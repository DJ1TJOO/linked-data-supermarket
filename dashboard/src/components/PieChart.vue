<script setup lang="ts" generic="
  T,
  LabelKey extends KeyOfExtends<T, string>,
  ValueKey extends KeyOfExtends<T, number>">
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    componentToString
} from "@/components/ui/chart";

import type { KeyOfExtends } from "@/lib/type";
import { Donut } from "@unovis/ts";
import { VisDonut, VisSingleContainer } from "@unovis/vue";

const props = defineProps<{
    config: Record<string, { label: string; color: string }>
    data?: (T & Record<LabelKey, string> & Record<ValueKey, number>)[];
    label: LabelKey
    value: ValueKey
}>()

const valueAccessor = (d: T) => d[props.value]

function labelFormatter(value: number | Date) {
    const item = props.data?.[Number(value)];
    return item ? String(item[props.label]) : String(value);
}
</script>

<template>
    <ChartContainer :config="config" class="h-80 flex items-center justify-center">
        <VisSingleContainer :data="data">
            <ChartTooltip :triggers="{
                [Donut.selectors.segment]: componentToString(config, ChartTooltipContent, {
                    labelFormatter,
                })
            }" />

            <VisDonut :value="valueAccessor" :arcWidth="100" :cornerRadius="6" />
        </VisSingleContainer>
    </ChartContainer>
</template>