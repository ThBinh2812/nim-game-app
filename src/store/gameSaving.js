import {
  exists,
  readTextFile,
  writeTextFile,
  mkdir,
  BaseDirectory,
} from "@tauri-apps/plugin-fs";
import { ref } from "vue";

const SAVE_DIR = "nim-saves";
const SAVE_FILE = "nim-saves/saved-games.json";
const savedGames = ref([]);

// Đảm bảo thư mục lưu tồn tại
async function ensureSaveDir() {
  const dirExists = await exists(SAVE_DIR, {
    baseDir: BaseDirectory.AppData,
  });
  if (!dirExists) {
    await mkdir(SAVE_DIR, {
      baseDir: BaseDirectory.AppData,
      recursive: true,
    });
  }
}

// Đọc danh sách game đã lưu từ file JSON
async function loadSavedGames() {
  try {
    await ensureSaveDir();
    const fileExists = await exists(SAVE_FILE, {
      baseDir: BaseDirectory.AppData,
    });

    if (!fileExists) {
      savedGames.value = [];
      return;
    }

    const content = await readTextFile(SAVE_FILE, {
      baseDir: BaseDirectory.AppData,
    });

    const parsed = JSON.parse(content);
    savedGames.value = Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Lỗi khi đọc file saved games:", error);
    savedGames.value = [];
  }
}

// Ghi danh sách game đã lưu ra file JSON
async function writeSavedGames() {
  try {
    await ensureSaveDir();
    await writeTextFile(SAVE_FILE, JSON.stringify(savedGames.value, null, 2), {
      baseDir: BaseDirectory.AppData,
    });
    return true;
  } catch (error) {
    console.error("Lỗi khi ghi file saved games:", error);
    return false;
  }
}

export { savedGames, loadSavedGames, writeSavedGames };