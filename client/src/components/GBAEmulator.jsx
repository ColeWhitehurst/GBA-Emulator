import { useEffect, useRef, useState } from "react";
import { createGBA } from "../emulator/createGBA";
import { fetchRoms, loadRom as fetchRomData, uploadRom } from "../api/routes";

const STATIC_ROMS = [
  { name: "Pokémon Emerald", file: "PokemonEmerald.gba" },
  { name: "Legend of Zelda", file: "LegendofZelda-TheMinishCap.gba" },
  { name: "Super Mario 3", file: "SuperMarioAdvance3YoshisIsland.gba" },
  { name: "Wario Ware Inc.", file: "WarioWare, Inc.gba" },
];

const GBAEmulator = () => {
  const [serverRoms, setServerRoms] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedRom, setSelectedRom] = useState(STATIC_ROMS[0].file);
  const canvasRef = useRef(null);
  const gbaRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    const gba = new createGBA(canvas);
    gba.setCanvas(canvas);
    gbaRef.current = gba;

    loadRom(selectedRom);

    return () => gba.pause();
  }, []);

  useEffect(() => {
    const getRoms = async () => {
      try {
        const romList = await fetchRoms();
        setServerRoms(romList);
      } catch (err) {
        setError("Failed to fetch server ROMs: " + err.message);
      }
    };

    getRoms();
  }, []);

  const loadRom = async (romFile) => {
    const gba = gbaRef.current;

    if (STATIC_ROMS.some((r) => r.file === romFile)) {
      await gba.loadRomFromUrl(`/roms/${romFile}`);
    } else {
      const romData = await fetchRomData(romFile);
      await gba.loadRomFromBytes(romData);
    }

    gba.runStable();
  };

  const handleRomChange = async (event) => {
    const romFile = event.target.value;
    setSelectedRom(romFile);

    const gba = gbaRef.current;
    gba.pause();
    await loadRom(romFile);
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const result = await uploadRom(file);
      setSuccess(result.message);
      const updatedRoms = await fetchRoms();
      setServerRoms(updatedRoms);
    } catch (err) {
      setError("Upload failed: " + err.message);
    }
  };

  return (
    <div>
      <h2>GBA Emulator</h2>

      <label htmlFor="rom-selector">Choose a game:</label>
      <select
        id="rom-selector"
        value={selectedRom}
        onChange={handleRomChange}
        style={{ marginLeft: "10px" }}
      >
        {STATIC_ROMS.map((rom) => (
          <option key={rom.file} value={rom.file}>
            {rom.name}
          </option>
        ))}
        {serverRoms.map((file) => (
          <option key={file} value={file}>
            {file.replace(".gba", "")} (Uploaded)
          </option>
        ))}
      </select>

      <input
        type="file"
        accept=".gba"
        onChange={handleUpload}
        style={{ display: "block", marginTop: "10px" }}
      />

      {success && <p style={{ color: "green" }}>{success}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <canvas
        ref={canvasRef}
        width="240"
        height="160"
        style={{ border: "1px solid black", marginTop: "20px" }}
      />
    </div>
  );
};

export default GBAEmulator;
