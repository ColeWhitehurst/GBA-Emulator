const API = "http://localhost:3001/api";

export const fetchRoms = async () => {
  try {
    const response = await fetch(`${API}/roms`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return await response.json();
  } catch (error) {
    throw new Error("Failed to fetch ROMs: " + error.message);
  }
};

export const loadRom = async (romName) => {
  try {
    const response = await fetch(`${API}/roms/${romName}`, {
      method: "GET",
    });
    const arrayBuffer = await response.arrayBuffer();
    return new Uint8Array(arrayBuffer);
  } catch (error) {
    throw new Error("Failed to load ROM: " + error.message);
  }
};

export const uploadRom = async (file) => {
  const formData = new FormData();
  formData.append("rom", file);

  try {
    const response = await fetch(`${API}/roms/upload`, {
      method: "POST",
      body: formData,
    });
    return await response.json();
  } catch (error) {
    throw new Error("Failed to upload ROM: " + error.message);
  }
};