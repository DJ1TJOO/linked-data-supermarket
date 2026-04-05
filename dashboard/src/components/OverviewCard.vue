<script setup lang="ts">
import { Card, CardContent } from './ui/card';

defineProps<{
    title: string;
    value: string;
    type: "default" | "danger" | "success";
}>()

const textColor = {
    default: "text-gray-800",
    danger: "text-red-600",
    success: "text-green-600",
}
</script>

<template>
    <Card>
        <CardContent class="py-6 flex flex-col items-center">
            <div class="text-lg font-semibold text-muted-foreground">{{ title }}</div>
            <div class="text-3xl font-bold mt-2" :class="textColor[type]">{{ value }}</div>
        </CardContent>
    </Card>
</template>