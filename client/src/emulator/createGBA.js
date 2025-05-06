import GBA from './gba.js';
import ARM7TDMI from './arm7tdmi.js';
import MMU from './mmu.js';
import GameBoyAdvanceSoftwareRenderer from './software.js';

export function createGBA(canvas) {
  const cpu = new ARM7TDMI();
  const mmu = new MMU();
  const video = new GameBoyAdvanceSoftwareRenderer(canvas);

  mmu.setVideo(video);
  cpu.setMMU(mmu);

  const gba = new GBA({ cpu, mmu, video });
  gba.setCanvas(canvas);

  return gba;
};
