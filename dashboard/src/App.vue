<script setup lang="ts">
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { ChartContainer, ChartCrosshair, ChartTooltip, ChartTooltipContent, componentToString } from "@/components/ui/chart"
import { Spinner } from "@/components/ui/spinner"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useBestPerformingCategories } from "@/composables/useBestPerformingCategories"
import { useHighestLossCostProducts } from "@/composables/useHighestLossCostProducts"
import { useHighestLossRateProducts } from "@/composables/useHighestLossRateProducts"
import { useHighestTurnoverProducts } from "@/composables/useHighestTurnoverProducts"
import { useHighestTurnoverVegetables } from "@/composables/useHighestTurnoverVegetables"
import { useMostSoldProducts } from "@/composables/useMostSoldProducts"
import { useProductHealthBenefits } from "@/composables/useProductHealthBenefits"
import { useProductSalesByDate } from "@/composables/useProductSalesByDate"
import { VisAxis, VisGroupedBar, VisXYContainer } from "@unovis/vue"
import { computed, ref } from "vue"

// Global filters
const selectedDate = ref("2020-07-01")
const selectedCategory = ref("")
// Removed unused selectedProduct


const q1Swrv = useMostSoldProducts()
const q2Swrv = useHighestTurnoverProducts()
const q3Swrv = useHighestTurnoverVegetables()
const q4Swrv = useBestPerformingCategories()
const q5Swrv = useHighestLossRateProducts()
const q6Swrv = useHighestLossCostProducts()
const q7Swrv = useProductSalesByDate(selectedDate)
const q8Swrv = useProductHealthBenefits()

const topQ1 = computed(() => (q1Swrv.data.value ?? []).slice(0, 10))
const topQ2 = computed(() => (q2Swrv.data.value ?? []).slice(0, 10))
const topQ3 = computed(() => (q3Swrv.data.value ?? []).slice(0, 10))
const topQ4 = computed(() => (q4Swrv.data.value ?? []).slice(0, 10))
const topQ5 = computed(() => (q5Swrv.data.value ?? []).slice(0, 10))
const topQ6 = computed(() => (q6Swrv.data.value ?? []).slice(0, 10))
const topQ7 = computed(() => (q7Swrv.data.value ?? []).slice(0, 15))
const topQ8 = computed(() => (q8Swrv.data.value ?? []).slice(0, 20))

const q1ChartData = computed(() => topQ1.value.map((row, xIndex) => ({ ...row, xIndex })))
const q2ChartData = computed(() => topQ2.value.map((row, xIndex) => ({ ...row, xIndex })))
const q3ChartData = computed(() => topQ3.value.map((row, xIndex) => ({ ...row, xIndex })))
const q6ChartData = computed(() => topQ6.value.map((row, xIndex) => ({ ...row, xIndex })))
const q7ChartData = computed(() => topQ7.value.map((row, xIndex) => ({ ...row, xIndex })))

const q1TickValues = computed(() => q1ChartData.value.map(d => d.xIndex))
const q2TickValues = computed(() => q2ChartData.value.map(d => d.xIndex))
const q3TickValues = computed(() => q3ChartData.value.map(d => d.xIndex))
const q6TickValues = computed(() => q6ChartData.value.map(d => d.xIndex))
const q7TickValues = computed(() => q7ChartData.value.map(d => d.xIndex))

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

const q1TickFormat = (value: number | Date): string => q1ChartData.value[toIndex(value)]?.productName || ""
const q2TickFormat = (value: number | Date): string => q2ChartData.value[toIndex(value)]?.productName || ""
const q3TickFormat = (value: number | Date): string => q3ChartData.value[toIndex(value)]?.vegetableName || ""
const q6TickFormat = (value: number | Date): string => q6ChartData.value[toIndex(value)]?.productName || ""
const q7TickFormat = (value: number | Date): string => q7ChartData.value[toIndex(value)]?.productName || ""

const busy = computed(() => [q1Swrv, q2Swrv, q3Swrv, q4Swrv, q5Swrv, q6Swrv, q7Swrv, q8Swrv].some(s => s.isValidating.value))
// Removed unused hasEndpoint
const categories = ref([
    "",
    "Flower/Leaf Vegetables",
    "Capsicum",
    "Edible Mushroom",
    // ...add more as needed
])
const products = ref([
    "",
    // ...populate with product names if needed
])

const formatNumber = (value: number, digits = 2): string => {
    return new Intl.NumberFormat("nl-NL", {
        minimumFractionDigits: 0,
        maximumFractionDigits: digits,
    }).format(value)
}

const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("nl-NL", {
        style: "currency",
        currency: "CNY",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value)
}

const runDateQuery = async () => {
    await q7Swrv.mutate()
}

const runRefreshAll = async () => {
    await Promise.all([
        q1Swrv.mutate(),
        q2Swrv.mutate(),
        q3Swrv.mutate(),
        q4Swrv.mutate(),
        q5Swrv.mutate(),
        q6Swrv.mutate(),
        q7Swrv.mutate(),
        q8Swrv.mutate(),
    ])
}
</script>


<template>
    <main class="min-h-screen bg-background">
        <section class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <!-- Dashboard Title -->
            <div class="mb-6">
                <h1 class="text-3xl font-bold tracking-tight">Supermarket Manager Dashboard</h1>
                <p class="max-w-4xl text-base text-muted-foreground leading-6">
                    Actionable insights and trends for supermarket operations, sales, and product performance.
                </p>
            </div>

            <!-- Global filter bar -->
            <div class="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-6">
                <label class="flex flex-col gap-1 text-sm">
                    <span class="font-medium">Date</span>
                    <input v-model="selectedDate" type="date" class="h-9 rounded-md border bg-background px-3">
                </label>
                <label class="flex flex-col gap-1 text-sm">
                    <span class="font-medium">Category</span>
                    <select v-model="selectedCategory" class="h-9 rounded-md border bg-background px-3">
                        <option v-for="cat in categories" :key="cat" :value="cat">{{ cat || 'All' }}</option>
                    </select>
                </label>
                <!--
                <label class="flex flex-col gap-1 text-sm">
                    <span class="font-medium">Product</span>
                    <select v-model="selectedProduct" class="h-9 rounded-md border bg-background px-3">
                        <option v-for="prod in products" :key="prod" :value="prod">{{ prod || 'All' }}</option>
                    </select>
                </label>
                -->
                <Button :disabled="busy" @click="runRefreshAll">
                    Apply Filters
                </Button>
            </div>

            <!-- KPI Cards Row -->
            <div class="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card class="bg-card/95">
                    <CardContent class="py-6 flex flex-col items-center">
                        <div class="text-lg font-semibold text-muted-foreground">Total Sales</div>
                        <div class="text-3xl font-bold mt-2">{{formatCurrency(q2Swrv.data.value?.reduce((sum, row) =>
                            sum
                            +
                            row.turnover, 0) ?? 0)}}</div>
                    </CardContent>
                </Card>
                <Card class="bg-card/95">
                    <CardContent class="py-6 flex flex-col items-center">
                        <div class="text-lg font-semibold text-muted-foreground">Total Loss</div>
                        <div class="text-3xl font-bold mt-2">{{formatCurrency(q6Swrv.data.value?.reduce((sum, row) =>
                            sum
                            +
                            row.losses, 0) ?? 0)}}</div>
                    </CardContent>
                </Card>
                <Card class="bg-card/95">
                    <CardContent class="py-6 flex flex-col items-center">
                        <div class="text-lg font-semibold text-muted-foreground">Top Product</div>
                        <div class="text-3xl font-bold mt-2">{{ topQ2[0]?.productName || '-' }}</div>
                    </CardContent>
                </Card>
                <Card class="bg-card/95">
                    <CardContent class="py-6 flex flex-col items-center">
                        <div class="text-lg font-semibold text-muted-foreground">Highest Loss Product</div>
                        <div class="text-3xl font-bold mt-2">{{ topQ6[0]?.productName || '-' }}</div>
                    </CardContent>
                </Card>
            </div>

            <!-- Main dashboard content area -->
            <div class="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <!-- Left: Sales trends, category/vegetable performance -->
                <div class="flex flex-col gap-6">
                    <!-- Q7: Sales trend for selected date (could be extended to range in future) -->
                    <Card class="border-border/80 bg-card/95 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle>Sales by Product (Selected Date)</CardTitle>
                            <CardDescription>
                                Daily sales distribution for resupply and trend analysis.
                            </CardDescription>
                        </CardHeader>
                        <CardContent class="space-y-4">
                            <ChartContainer :config="{ sales: { label: 'Sales (KG)', color: 'var(--chart-4)' } }"
                                class="h-80">
                                <VisXYContainer :data="q7ChartData"
                                    :yDomain="[0, Math.max(...q7ChartData.map(d => d.sales), 0)]">
                                    <ChartTooltip />
                                    <ChartCrosshair
                                        :template="componentToString({ sales: { label: 'Sales (KG)', color: 'var(--chart-4)' } }, ChartTooltipContent, { labelFormatter(x) { const item = q7ChartData[x as number]; if (!item) return ''; return item.productName; }, })"
                                        :color="(data: any) => barColors[data.xIndex % barColors.length]" />
                                    <VisGroupedBar :x="(d: any) => d.xIndex" :y="(d: any) => d.sales"
                                        :color="(data: any) => barColors[data.xIndex % barColors.length]" />
                                    <VisAxis type="x" :tickTextAngle="-30" :tickTextAlign="'end'"
                                        :tickFormat="q7TickFormat" :tickValues="q7TickValues" />
                                    <VisAxis type="y" />
                                </VisXYContainer>
                            </ChartContainer>
                            <p class="text-sm text-muted-foreground">Showing top {{ topQ7.length }} products for {{
                                selectedDate }}.</p>
                        </CardContent>
                    </Card>

                    <!-- Q4: Category performance -->
                    <Card class="border-border/80 bg-card/95 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle>Category Performance</CardTitle>
                            <CardDescription>
                                Revenue and quantity by category for the selected period.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Category</TableHead>
                                        <TableHead>Revenue</TableHead>
                                        <TableHead>Quantity (KG)</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow v-for="row in topQ4" :key="`q4-${row.categoryName}`">
                                        <TableCell>{{ row.categoryName }}</TableCell>
                                        <TableCell>{{ formatCurrency(row.totalRevenue) }}</TableCell>
                                        <TableCell>{{ formatNumber(row.totalQuantity) }}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    <!-- Q3: Vegetable performance -->
                    <Card class="border-border/80 bg-card/95 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle>Vegetables with Highest Turnover</CardTitle>
                            <CardDescription>
                                Performance at vegetable level (not SKU).
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer :config="{ veg: { label: 'Vegetable turnover', color: 'var(--chart-1)' } }"
                                class="h-72">
                                <VisXYContainer :data="q3ChartData"
                                    :yDomain="[0, Math.max(...q3ChartData.map(d => d.turnover), 0)]">
                                    <ChartTooltip />
                                    <ChartCrosshair
                                        :template="componentToString({ veg: { label: 'Vegetable turnover', color: 'var(--chart-1)' } }, ChartTooltipContent, { labelFormatter(x) { const item = q3ChartData[x as number]; if (!item) return ''; return item.vegetableName; }, })"
                                        :color="(data: any) => barColors[data.xIndex % barColors.length]" />
                                    <VisGroupedBar :x="(d: any) => d.xIndex" :y="(d: any) => d.turnover"
                                        :color="(data: any) => barColors[data.xIndex % barColors.length]" />
                                    <VisAxis type="x" :tickTextAngle="-30" :tickTextAlign="'end'"
                                        :tickFormat="q3TickFormat" :tickValues="q3TickValues" />
                                    <VisAxis type="y" />
                                </VisXYContainer>
                            </ChartContainer>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Rank</TableHead>
                                        <TableHead>Vegetable</TableHead>
                                        <TableHead>Turnover</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow v-for="(item, index) in topQ3.slice(0, 5)"
                                        :key="`q3-${item.vegetableName}`">
                                        <TableCell>#{{ index + 1 }}</TableCell>
                                        <TableCell>{{ item.vegetableName }}</TableCell>
                                        <TableCell>{{ formatCurrency(item.turnover) }}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>

                <!-- Right: Top/bottom products, losses -->
                <div class="flex flex-col gap-6">
                    <!-- Q1: Most sold products -->
                    <Card class="border-border/80 bg-card/95 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle>Most Sold Products (KG)</CardTitle>
                            <CardDescription>
                                Volume and turnover are related, but not identical. Wuhu Green Pepper appears high on
                                volume while Broccoli can outrank it on turnover due to pricing.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer :config="{ sum: { label: 'Sold KG', color: 'var(--chart-2)' } }"
                                class="h-72">
                                <VisXYContainer :data="q1ChartData"
                                    :yDomain="[0, Math.max(...q1ChartData.map(d => d.sum), 0)]">
                                    <ChartTooltip />
                                    <ChartCrosshair
                                        :template="componentToString({ sum: { label: 'Sold KG', color: 'var(--chart-2)' } }, ChartTooltipContent, { labelFormatter(x) { const item = q1ChartData[x as number]; if (!item) return ''; return item.productName; }, })"
                                        :color="(data: any) => barColors[data.xIndex % barColors.length]" />
                                    <VisGroupedBar :x="(d: any) => d.xIndex" :y="(d: any) => d.sum"
                                        :color="(data: any) => barColors[data.xIndex % barColors.length]" />
                                    <VisAxis type="x" :tickTextAngle="-30" :tickTextAlign="'end'"
                                        :tickFormat="q1TickFormat" :tickValues="q1TickValues" />
                                    <VisAxis type="y" />
                                </VisXYContainer>
                            </ChartContainer>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Rank</TableHead>
                                        <TableHead>Product</TableHead>
                                        <TableHead>Sold (KG)</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow v-for="(item, index) in topQ1.slice(0, 5)"
                                        :key="`q1-${item.productName}`">
                                        <TableCell>#{{ index + 1 }}</TableCell>
                                        <TableCell>{{ item.productName }}</TableCell>
                                        <TableCell>{{ formatNumber(item.sum) }} kg</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    <!-- Q2: Highest turnover products -->
                    <Card class="border-border/80 bg-card/95 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle>Highest Turnover Products</CardTitle>
                            <CardDescription>
                                Top turnover products differ from pure volume ranking, confirming price mix effects.
                                Broccoli and Xixia Mushroom stand out in revenue contribution.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer :config="{ turnover: { label: 'Turnover', color: 'var(--chart-3)' } }"
                                class="h-72">
                                <VisXYContainer :data="q2ChartData"
                                    :yDomain="[0, Math.max(...q2ChartData.map(d => d.turnover), 0)]">
                                    <ChartTooltip />
                                    <ChartCrosshair
                                        :template="componentToString({ turnover: { label: 'Turnover', color: 'var(--chart-3)' } }, ChartTooltipContent, { labelFormatter(x) { const item = q2ChartData[x as number]; if (!item) return ''; return item.productName; }, })"
                                        :color="(data: any) => barColors[data.xIndex % barColors.length]" />
                                    <VisGroupedBar :x="(d: any) => d.xIndex" :y="(d: any) => d.turnover"
                                        :color="(data: any) => barColors[data.xIndex % barColors.length]" />
                                    <VisAxis type="x" :tickTextAngle="-30" :tickTextAlign="'end'"
                                        :tickFormat="q2TickFormat" :tickValues="q2TickValues" />
                                    <VisAxis type="y" />
                                </VisXYContainer>
                            </ChartContainer>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Rank</TableHead>
                                        <TableHead>Product</TableHead>
                                        <TableHead>Turnover</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow v-for="(item, index) in topQ2.slice(0, 5)"
                                        :key="`q2-${item.productName}`">
                                        <TableCell>#{{ index + 1 }}</TableCell>
                                        <TableCell>{{ item.productName }}</TableCell>
                                        <TableCell>{{ formatCurrency(item.turnover) }}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    <!-- Q5: Products with highest loss rates -->
                    <Card class="border-border/80 bg-card/95 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle>Products with Highest Loss Rates</CardTitle>
                            <CardDescription>
                                High loss-rate products are operationally critical even when their turnover rank is not
                                in the top segment.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Product</TableHead>
                                        <TableHead>Loss rate (%)</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow v-for="row in topQ5" :key="`q5-${row.productName}`">
                                        <TableCell>{{ row.productName }}</TableCell>
                                        <TableCell>{{ formatNumber(row.lossRate, 2) }}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    <!-- Q6: Products with highest lost revenue -->
                    <Card class="border-border/80 bg-card/95 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle>Products with Highest Lost Revenue</CardTitle>
                            <CardDescription>
                                Broccoli and Xixia Mushroom stand out in lost revenue due to the combination of high
                                sales volume, non-zero loss rate, and cost structure.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer :config="{ losses: { label: 'Lost revenue', color: 'var(--chart-5)' } }"
                                class="h-72">
                                <VisXYContainer :data="q6ChartData"
                                    :yDomain="[0, Math.max(...q6ChartData.map(d => d.losses), 0)]">
                                    <ChartTooltip />
                                    <ChartCrosshair
                                        :template="componentToString({ losses: { label: 'Lost revenue', color: 'var(--chart-5)' } }, ChartTooltipContent, { labelFormatter(x) { const item = q6ChartData[x as number]; if (!item) return ''; return item.productName; }, })"
                                        :color="(data: any) => barColors[data.xIndex % barColors.length]" />
                                    <VisGroupedBar :x="(d: any) => d.xIndex" :y="(d: any) => d.losses"
                                        :color="(data: any) => barColors[data.xIndex % barColors.length]" />
                                    <VisAxis type="x" :tickTextAngle="-30" :tickTextAlign="'end'"
                                        :tickFormat="q6TickFormat" :tickValues="q6TickValues" />
                                    <VisAxis type="y" />
                                </VisXYContainer>
                            </ChartContainer>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Rank</TableHead>
                                        <TableHead>Product</TableHead>
                                        <TableHead>Lost revenue</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow v-for="(item, index) in topQ6.slice(0, 5)"
                                        :key="`q6-${item.productName}`">
                                        <TableCell>#{{ index + 1 }}</TableCell>
                                        <TableCell>{{ item.productName }}</TableCell>
                                        <TableCell>{{ formatCurrency(item.losses) }}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <!-- Full-width: Health benefits table -->
            <div class="mt-8">
                <Card class="border-border/80 bg-card/95 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle>Health Benefits per Product</CardTitle>
                        <CardDescription>
                            Links products to known vegetable-level health benefits for labeling and recommendations.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Product</TableHead>
                                    <TableHead>Health benefits</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow v-for="row in topQ8" :key="`q8-${row.productName}`">
                                    <TableCell>{{ row.productName }}</TableCell>
                                    <TableCell class="max-w-4xl whitespace-normal">{{ row.health }}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </section>
    </main>

    <div class="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card ref="q1Section" class="border-border/80 bg-card/95 backdrop-blur-sm">
            <CardHeader>
                <CardTitle>Q1. Most sold products (KG)</CardTitle>
                <CardDescription>
                    Volume and turnover are related, but not identical. Wuhu Green Pepper appears high on volume
                    while Broccoli can outrank it on turnover due to pricing.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div v-if="q1Swrv.isValidating.value" class="flex items-center gap-2 text-sm text-muted-foreground">
                    <Spinner class="size-4" />
                    <span>Loading query...</span>
                </div>
                <div v-else-if="q1Swrv.error.value" class="text-sm text-destructive">{{ q1Swrv.error.value }}</div>
                <div v-else class="space-y-4">
                    <ChartContainer :config="{ sum: { label: 'Sold KG', color: 'var(--chart-2)' } }" class="h-72">
                        <VisXYContainer :data="q1ChartData" :yDomain="[0, Math.max(...q1ChartData.map(d => d.sum), 0)]">
                            <ChartTooltip />
                            <ChartCrosshair :template="componentToString(
                                { sum: { label: 'Sold KG', color: 'var(--chart-2)' } },
                                ChartTooltipContent,
                                {
                                    labelFormatter(x) {
                                        const item = q1ChartData[x as number];
                                        if (!item) return '';
                                        return item.productName;
                                    },
                                }
                            )" :color="(data: any) => barColors[data.xIndex % barColors.length]" />
                            <VisGroupedBar :x="(d: any) => d.xIndex" :y="(d: any) => d.sum"
                                :color="(data: any) => barColors[data.xIndex % barColors.length]" />
                            <VisAxis type="x" :tickTextAngle="-30" :tickTextAlign="'end'" :tickFormat="q1TickFormat"
                                :tickValues="q1TickValues" />
                            <VisAxis type="y" />
                        </VisXYContainer>
                    </ChartContainer>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Rank</TableHead>
                                <TableHead>Product</TableHead>
                                <TableHead>Sold (KG)</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow v-for="(item, index) in topQ1.slice(0, 5)" :key="`q1-${item.productName}`">
                                <TableCell>#{{ index + 1 }}</TableCell>
                                <TableCell>{{ item.productName }}</TableCell>
                                <TableCell>{{ formatNumber(item.sum) }} kg</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>

        <Card ref="q2Section" class="border-border/80 bg-card/95 backdrop-blur-sm">
            <CardHeader>
                <CardTitle>Q2. Highest turnover products</CardTitle>
                <CardDescription>
                    Top turnover products differ from pure volume ranking, confirming price mix effects.
                    Broccoli and
                    Xixia Mushroom stand out in revenue contribution.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div v-if="q2Swrv.isValidating.value" class="flex items-center gap-2 text-sm text-muted-foreground">
                    <Spinner class="size-4" />
                    <span>Loading query...</span>
                </div>
                <div v-else-if="q2Swrv.error.value" class="text-sm text-destructive">{{ q2Swrv.error.value }}</div>
                <div v-else class="space-y-4">
                    <ChartContainer :config="{ turnover: { label: 'Turnover', color: 'var(--chart-3)' } }" class="h-72">
                        <VisXYContainer :data="q2ChartData"
                            :yDomain="[0, Math.max(...q2ChartData.map(d => d.turnover), 0)]">
                            <ChartTooltip />
                            <ChartCrosshair :template="componentToString(
                                { turnover: { label: 'Turnover', color: 'var(--chart-3)' } },
                                ChartTooltipContent,
                                {
                                    labelFormatter(x) {
                                        const item = q2ChartData[x as number];
                                        if (!item) return '';
                                        return item.productName;
                                    },
                                }
                            )" :color="(data: any) => barColors[data.xIndex % barColors.length]" />
                            <VisGroupedBar :x="(d: any) => d.xIndex" :y="(d: any) => d.turnover"
                                :color="(data: any) => barColors[data.xIndex % barColors.length]" />
                            <VisAxis type="x" :tickTextAngle="-30" :tickTextAlign="'end'" :tickFormat="q2TickFormat"
                                :tickValues="q2TickValues" />
                            <VisAxis type="y" />
                        </VisXYContainer>
                    </ChartContainer>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Rank</TableHead>
                                <TableHead>Product</TableHead>
                                <TableHead>Turnover</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow v-for="(item, index) in topQ2.slice(0, 5)" :key="`q2-${item.productName}`">
                                <TableCell>#{{ index + 1 }}</TableCell>
                                <TableCell>{{ item.productName }}</TableCell>
                                <TableCell>{{ formatCurrency(item.turnover) }}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>

        <Card ref="q3Section" class="border-border/80 bg-card/95 backdrop-blur-sm">
            <CardHeader>
                <CardTitle>Q3. Vegetables with highest turnover</CardTitle>
                <CardDescription>
                    Bell Pepper and Poblano Pepper can appear equally strong due to naming and variant mappings.
                    This section surfaces performance at vegetable level rather than product SKU level.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div v-if="q3Swrv.isValidating.value" class="flex items-center gap-2 text-sm text-muted-foreground">
                    <Spinner class="size-4" />
                    <span>Loading query...</span>
                </div>
                <div v-else-if="q3Swrv.error.value" class="text-sm text-destructive">{{ q3Swrv.error.value }}</div>
                <div v-else class="space-y-4">
                    <ChartContainer :config="{ veg: { label: 'Vegetable turnover', color: 'var(--chart-1)' } }"
                        class="h-72">
                        <VisXYContainer :data="q3ChartData"
                            :yDomain="[0, Math.max(...q3ChartData.map(d => d.turnover), 0)]">
                            <ChartTooltip />
                            <ChartCrosshair :template="componentToString(
                                { veg: { label: 'Vegetable turnover', color: 'var(--chart-1)' } },
                                ChartTooltipContent,
                                {
                                    labelFormatter(x) {
                                        const item = q3ChartData[x as number];
                                        if (!item) return '';
                                        return item.vegetableName;
                                    },
                                }
                            )" :color="(data: any) => barColors[data.xIndex % barColors.length]" />
                            <VisGroupedBar :x="(d: any) => d.xIndex" :y="(d: any) => d.turnover"
                                :color="(data: any) => barColors[data.xIndex % barColors.length]" />
                            <VisAxis type="x" :tickTextAngle="-30" :tickTextAlign="'end'" :tickFormat="q3TickFormat"
                                :tickValues="q3TickValues" />
                            <VisAxis type="y" />
                        </VisXYContainer>
                    </ChartContainer>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Rank</TableHead>
                                <TableHead>Vegetable</TableHead>
                                <TableHead>Turnover</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow v-for="(item, index) in topQ3.slice(0, 5)" :key="`q3-${item.vegetableName}`">
                                <TableCell>#{{ index + 1 }}</TableCell>
                                <TableCell>{{ item.vegetableName }}</TableCell>
                                <TableCell>{{ formatCurrency(item.turnover) }}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>

        <Card ref="q4Section" class="border-border/80 bg-card/95 backdrop-blur-sm">
            <CardHeader>
                <CardTitle>Q4. Best-performing categories</CardTitle>
                <CardDescription>
                    Flower/Leaf Vegetables lead total revenue, followed by Capsicum and Edible Mushroom. Revenue
                    and
                    sold quantity are shown side-by-side to compare value versus volume.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div v-if="q4Swrv.isValidating.value" class="flex items-center gap-2 text-sm text-muted-foreground">
                    <Spinner class="size-4" />
                    <span>Loading query...</span>
                </div>
                <div v-else-if="q4Swrv.error.value" class="text-sm text-destructive">{{ q4Swrv.error.value }}</div>
                <div v-else class="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Category</TableHead>
                                <TableHead>Revenue</TableHead>
                                <TableHead>Quantity (KG)</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow v-for="row in topQ4" :key="`q4-${row.categoryName}`">
                                <TableCell>{{ row.categoryName }}</TableCell>
                                <TableCell>{{ formatCurrency(row.totalRevenue) }}</TableCell>
                                <TableCell>{{ formatNumber(row.totalQuantity) }}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>

        <Card ref="q5Section" class="border-border/80 bg-card/95 backdrop-blur-sm">
            <CardHeader>
                <CardTitle>Q5. Products with highest loss rates</CardTitle>
                <CardDescription>
                    High Melon and Chuncai are among top loss-rate products. High loss-rate products are
                    operationally
                    critical even when their turnover rank is not in the top segment.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div v-if="q5Swrv.isValidating.value" class="flex items-center gap-2 text-sm text-muted-foreground">
                    <Spinner class="size-4" />
                    <span>Loading query...</span>
                </div>
                <div v-else-if="q5Swrv.error.value" class="text-sm text-destructive">{{ q5Swrv.error.value }}</div>
                <div v-else class="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Product</TableHead>
                                <TableHead>Loss rate (%)</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow v-for="row in topQ5" :key="`q5-${row.productName}`">
                                <TableCell>{{ row.productName }}</TableCell>
                                <TableCell>{{ formatNumber(row.lossRate, 2) }}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>

        <Card ref="q6Section" class="border-border/80 bg-card/95 backdrop-blur-sm">
            <CardHeader>
                <CardTitle>Q6. Products with highest lost revenue</CardTitle>
                <CardDescription>
                    Broccoli and Xixia Mushroom stand out in lost revenue due to the combination of high sales
                    volume,
                    non-zero loss rate, and cost structure.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div v-if="q6Swrv.isValidating.value" class="flex items-center gap-2 text-sm text-muted-foreground">
                    <Spinner class="size-4" />
                    <span>Loading query...</span>
                </div>
                <div v-else-if="q6Swrv.error.value" class="text-sm text-destructive">{{ q6Swrv.error.value }}</div>
                <div v-else class="space-y-4">
                    <ChartContainer :config="{ losses: { label: 'Lost revenue', color: 'var(--chart-5)' } }"
                        class="h-72">
                        <VisXYContainer :data="q6ChartData"
                            :yDomain="[0, Math.max(...q6ChartData.map(d => d.losses), 0)]">
                            <ChartTooltip />
                            <ChartCrosshair :template="componentToString(
                                { losses: { label: 'Lost revenue', color: 'var(--chart-5)' } },
                                ChartTooltipContent,
                                {
                                    labelFormatter(x) {
                                        const item = q6ChartData[x as number];
                                        if (!item) return '';
                                        return item.productName;
                                    },
                                }
                            )" :color="(data: any) => barColors[data.xIndex % barColors.length]" />
                            <VisGroupedBar :x="(d: any) => d.xIndex" :y="(d: any) => d.losses"
                                :color="(data: any) => barColors[data.xIndex % barColors.length]" />
                            <VisAxis type="x" :tickTextAngle="-30" :tickTextAlign="'end'" :tickFormat="q6TickFormat"
                                :tickValues="q6TickValues" />
                            <VisAxis type="y" />
                        </VisXYContainer>
                    </ChartContainer>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Rank</TableHead>
                                <TableHead>Product</TableHead>
                                <TableHead>Lost revenue</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow v-for="(item, index) in topQ6.slice(0, 5)" :key="`q6-${item.productName}`">
                                <TableCell>#{{ index + 1 }}</TableCell>
                                <TableCell>{{ item.productName }}</TableCell>
                                <TableCell>{{ formatCurrency(item.losses) }}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>

        <Card ref="q7Section" class="border-border/80 bg-card/95 backdrop-blur-sm xl:col-span-2">
            <CardHeader>
                <CardTitle>Q7. Product sales for a selected date</CardTitle>
                <CardDescription>
                    Use the date filter to inspect daily sales distribution and support resupply planning.
                </CardDescription>
            </CardHeader>
            <CardContent class="space-y-4">
                <div class="flex flex-col gap-3 sm:flex-row sm:items-end">
                    <label class="flex flex-col gap-1 text-sm">
                        <span class="font-medium">Date</span>
                        <input v-model="selectedDate" type="date" class="h-9 rounded-md border bg-background px-3">
                    </label>
                    <Button :disabled="q7Swrv.isValidating.value" @click="runDateQuery">
                        {{ q7Swrv.isValidating.value ? "Running..." : "Run date query" }}
                    </Button>
                </div>
                <div v-if="q7Swrv.error.value" class="text-sm text-destructive">{{ q7Swrv.error.value }}</div>
                <div v-else-if="q7Swrv.isValidating.value"
                    class="flex items-center gap-2 text-sm text-muted-foreground">
                    <Spinner class="size-4" />
                    <span>Loading query...</span>
                </div>
                <div v-else class="space-y-4">
                    <ChartContainer :config="{ sales: { label: 'Sales (KG)', color: 'var(--chart-4)' } }" class="h-80">
                        <VisXYContainer :data="q7ChartData"
                            :yDomain="[0, Math.max(...q7ChartData.map(d => d.sales), 0)]">
                            <ChartTooltip />
                            <ChartCrosshair :template="componentToString(
                                { sales: { label: 'Sales (KG)', color: 'var(--chart-4)' } },
                                ChartTooltipContent,
                                {
                                    labelFormatter(x) {
                                        const item = q7ChartData[x as number];
                                        if (!item) return '';
                                        return item.productName;
                                    },
                                }
                            )" :color="(data: any) => barColors[data.xIndex % barColors.length]" />
                            <VisGroupedBar :x="(d: any) => d.xIndex" :y="(d: any) => d.sales"
                                :color="(data: any) => barColors[data.xIndex % barColors.length]" />
                            <VisAxis type="x" :tickTextAngle="-30" :tickTextAlign="'end'" :tickFormat="q7TickFormat"
                                :tickValues="q7TickValues" />
                            <VisAxis type="y" />
                        </VisXYContainer>
                    </ChartContainer>
                    <p class="text-sm text-muted-foreground">
                        Showing top {{ topQ7.length }} products for {{ selectedDate }}.
                    </p>
                </div>
            </CardContent>
        </Card>

        <Card ref="q8Section" class="border-border/80 bg-card/95 backdrop-blur-sm xl:col-span-2">
            <CardHeader>
                <CardTitle>Q8. Health benefits per product</CardTitle>
                <CardDescription>
                    This table links products to known vegetable-level health benefits and supports content,
                    labeling,
                    and recommendation use cases.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div v-if="q8Swrv.isValidating.value" class="flex items-center gap-2 text-sm text-muted-foreground">
                    <Spinner class="size-4" />
                    <span>Loading query...</span>
                </div>
                <div v-else-if="q8Swrv.error.value" class="text-sm text-destructive">{{ q8Swrv.error.value }}</div>
                <div v-else class="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Product</TableHead>
                                <TableHead>Health benefits</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow v-for="row in topQ8" :key="`q8-${row.productName}`">
                                <TableCell>{{ row.productName }}</TableCell>
                                <TableCell class="max-w-4xl whitespace-normal">{{ row.health }}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    </div>
    <!-- The new layout already closes the section and main tags above. Remove these duplicates. -->
</template>
