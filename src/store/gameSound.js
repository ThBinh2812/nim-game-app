import clickEffect from "@/assets/clickEffect.wav";
import menuClick2 from "@/assets/menuClick2.wav";
import menuClick from "@/assets/menuClick.wav";
import winSound from "@/assets/winnerPopup.wav";
import bgm from "@/assets/bgm.mp3";

const backGroundMusic = new Audio(bgm);
backGroundMusic.loop = true;
backGroundMusic.volume = 0.3; // default volume (0 → 1)

export function setBGMVolume(v) {
  backGroundMusic.volume = v;
}

export function getBGMVolume() {
  return backGroundMusic.volume;
}

export function playBGM() {
  backGroundMusic.play();
}

export function stopBGM() {
  backGroundMusic.pause();
}

let SFXVolume = 0.5; // default volume (0 → 1)

// factory tạo audio mới mỗi lần play (tránh bị cắt âm)
function playSound(src) {
  const audio = new Audio(src);
  audio.volume = SFXVolume;
  audio.play();
}

// ===== EXPORT =====
export function playClickEffect() {
  playSound(clickEffect);
}

export function playMenuClick() {
  playSound(menuClick);
}

export function playMenuClick2() {
  playSound(menuClick2);
}

export function playWinSound() {
  playSound(winSound);
}

// ===== CONTROL =====
export function setSFXVolume(v) {
  SFXVolume = v;
}

export function getSFXVolume() {
  return SFXVolume;
}
