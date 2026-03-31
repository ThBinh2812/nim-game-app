<template>
  <div class="flex flex-col items-center gap-3">
    <!-- PILE BOX -->
    <!-- <div
      class="border border-white/15 rounded-xl p-[clamp(6px,1vw,16px)] bg-white/[0.02] backdrop-blur-sm transition hover:border-blue-400/50"
    > -->
    <div
      class="group border rounded-xl p-[clamp(6px,1vw,16px)] backdrop-blur-sm transition"
      :title="count === 0 ? 'Đống đã hết' : 'Chọn đá trong đống này'"
      :class="[
        count === 0
          ? 'border-white/15 bg-white/[0.02] cursor-not-allowed empty-pile'
          : selected > 0
            ? isAI
              ? 'border-purple-400 bg-purple-500/10 shadow-md shadow-purple-500/30'
              : 'border-blue-400 bg-blue-500/10 shadow-md shadow-blue-500/30'
            : 'border-white/15 bg-white/[0.02] hover:border-blue-400/50',
      ]"
    >
      <!-- STONES -->
      <div class="grid grid-cols-10 gap-[clamp(4px,0.6vw,12px)] justify-center">
        <div
          v-if="count > 0"
          v-for="i in count"
          :key="`stone-${i}`"
          @click="selectStone(i)"
          class="w-[clamp(18px,1.8vw,36px)] h-[clamp(18px,1.8vw,36px)] rounded-full border transition cursor-pointer"
          :class="
            i <= selected
              ? isAI
                ? 'border-purple-400 bg-purple-500/40 shadow-md shadow-purple-500/30'
                : 'border-blue-400 bg-blue-500/40 shadow-md shadow-blue-500/30'
              : 'border-white/20 bg-white/5 hover:bg-blue-500/20'
          "
        ></div>

        <div
          v-else
          v-for="i in 10"
          :key="`empty-${i}`"
          class="empty-stone w-[clamp(18px,1.8vw,36px)] h-[clamp(18px,1.8vw,36px)] rounded-full border border-white/10 bg-transparent opacity-45"
        ></div>
      </div>
    </div>

    <!-- LABEL -->

    <span class="text-xs text-gray-400"> {{ label }} ({{ count }}) </span>
  </div>
</template>

<script setup>
const props = defineProps({
  count: Number,
  index: Number,
  label: String,
  selected: Number,
  isAI: Boolean,
});
import { playClickEffect } from '../store/gameSound';

const emit = defineEmits(["remove"]);

function selectStone(removeCount) {

  playClickEffect();

  emit("remove", {
    heapIndex: props.index,
    removeCount,
  });
}
</script>
<style scoped>
.stone-leave-active {
  transition: all 0.3s ease;
}

.stone-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.5);
}

.empty-pile:hover {
  border-color: rgba(252, 165, 165, 0.8);
  background: rgba(127, 29, 29, 0.12);
  box-shadow: 0 0 0 1px rgba(252, 165, 165, 0.25);
}

.empty-pile:hover .empty-stone {
  border-color: rgba(252, 165, 165, 0.55);
  opacity: 0.8;
}
</style>
