<template>

  <div
    class="
    border border-white/10
    rounded-xl
    p-4
    bg-white/[0.02]
    backdrop-blur-sm
    space-y-3
    "
  >

    <h3 class="text-xs tracking-widest text-gray-400">
      CÁCH CHƠI
    </h3>


    <!-- NORMAL NIM -->

    <ul
      v-if="gameRules === 'NORMAL'"
      class="text-sm text-gray-300 space-y-2 leading-relaxed"
    >

      <li>• Chọn <span class="text-blue-400">một đống đá</span></li>

      <li>• Lấy số viên đá bất kỳ</li>

      <li>• Nhấn <span class="text-blue-400">kết thúc lượt</span></li>

      <li>
        Người lấy viên đá cuối cùng sẽ
        <span class="text-blue-400">
          thắng
        </span>
      </li>

    </ul>


    <!-- MISERE NIM -->

    <ul
      v-else
      class="text-sm text-gray-300 space-y-2 leading-relaxed"
    >

      <li>• Chọn <span class="text-blue-400">một đống đá</span></li>

      <li>• Lấy số viên đá bất kỳ</li>

      <li>• Nhấn <span class="text-blue-400">kết thúc lượt</span></li>

      <li>
        Người lấy viên đá cuối cùng sẽ
        <span class="text-red-400">
          thua
        </span>
      </li>

    </ul>



    <!-- RULE LABEL -->

    <div class="border-t border-white/10 pt-3 text-xs text-gray-500">

      Luật chơi:

      <span
        v-if="gameRules === 'NORMAL'"
        class="text-blue-400"
      >
        Thông thường
      </span>

      <span
        v-else
        class="text-red-400"
      >
        Misère Nim
      </span>

    </div>

  </div>

</template>


<script setup>

const props = defineProps({
  gameRules:String
})

const gameRules = props.gameRules

</script>