<template>

  <Menu
    v-if="screen==='MENU'"
    @startGame="launchGame"
    @continueGame="screen='HISTORY'"
  />

  <Game
    v-if="screen==='GAME'"
    :gameMode="gameMode"
    :gameSize="gameSize"
    :gameRules="gameRules"
    :gameAI="gameAI"
    @goMenu="screen='MENU'"
  />

  <HistoryMatch
    v-if="screen==='HISTORY'"
    @goMenu="screen='MENU'"
    @loadMatch="loadSavedGame"
  />

</template>

<script setup>

import { ref } from "vue";

import Menu from "@/views/Menu.vue";
import Game from "@/views/NimGame.vue";
import HistoryMatch from "@/views/historyMatch.vue";

const screen = ref("MENU");

const gameMode = ref("PVP");
const gameSize = ref("MEDIUM");
const gameRules = ref("NORMAL");
const gameAI = ref("EASY");

function launchGame(data){

  gameSize.value=data.size;
  gameMode.value=data.mode;
  gameRules.value=data.rule;
  gameAI.value=data.ai;

  screen.value="GAME";

}

function loadSavedGame(match){

  gameMode.value = match.mode
  gameSize.value = match.size
  gameRules.value = match.rule
  gameAI.value = match.ai

  screen.value = "GAME"

}

</script>