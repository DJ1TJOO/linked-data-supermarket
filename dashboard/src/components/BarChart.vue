<script setup lang="ts" generic="
  T,
  XKey extends KeyOfExtends<T, string>,
  YKey extends KeyOfExtends<T, number>">
import { ChartContainer, ChartCrosshair, ChartTooltip, ChartTooltipContent, componentToString } from "@/components/ui/chart";
import type { KeyOfExtends } from "@/lib/type";
import { VisAxis, VisGroupedBar, VisXYContainer } from "@unovis/vue";
import { computed } from "vue";

type DataWithIndex<T> = T & { index: number };

const barColors = [
    'var(--chart-1)',
    'var(--chart-2)',
    'var(--chart-3)'
]

const toIndex = (value: number | Date): number => {
    if (value instanceof Date) {
        return 0
    }
    return Math.round(value)
}

const { data, xAxis, yAxis, config, yMax } = defineProps<{
    config: Record<string, { label: string; color: string }>;
    data?: (T & Record<XKey, string> & Record<YKey, number>)[];
    xAxis: XKey;
    yAxis: YKey;
    yMax?: number;
}>();

const dataWithIndex = computed(() => data?.map((d, i) => ({ ...d, index: i })) ?? []);

const xAccessor = (d: DataWithIndex<T>) => d.index;
const yAccessor = (d: DataWithIndex<T>) => d[yAxis];
const barColor = (d: DataWithIndex<T>) => barColors ? barColors[d.index % barColors.length] : 'var(--chart-1)';

const xTickFormat = (v: number | Date) => {
    const item = dataWithIndex.value[toIndex(v)];
    if (!item) return '';
    return String(item[xAxis]);
};
const xTickValues = computed(() => dataWithIndex.value.map((x) => x.index));

function xLabelFormatter(x: number | Date): string {
    const item = dataWithIndex.value[toIndex(x)];
    if (!item) return '';
    return String(item[xAxis]);
}
</script>

<template>
    <ChartContainer :config="config" class="h-80">
        <VisXYContainer :data="dataWithIndex"
            :yDomain="[0, yMax !== undefined ? yMax : Math.max(...dataWithIndex.map(d => d[yAxis]), 0)]">
            <ChartTooltip />
            <ChartCrosshair
                :template="componentToString(config, ChartTooltipContent, { labelFormatter: xLabelFormatter })"
                :color="barColor" />
            <VisGroupedBar :x="xAccessor" :y="yAccessor" :color="barColor" />
            <VisAxis type="x" :tickTextAngle="-30" :tickTextAlign="'end'" :tickFormat="xTickFormat"
                :tickValues="xTickValues" />
            <VisAxis type="y" />
        </VisXYContainer>
    </ChartContainer>
</template>
