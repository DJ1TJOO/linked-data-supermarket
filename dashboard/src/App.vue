<script setup lang="ts">
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { useProductSales } from "@/composables/useProductSales"
import { formatCurrency, formatNumber } from "@/lib/format"
import { computed, ref } from "vue"
import BarChart from "./components/BarChart.vue"
import OverviewCard from "./components/OverviewCard.vue"
import PieChart from "./components/PieChart.vue"
import { Badge } from "./components/ui/badge"
import { Spinner } from "./components/ui/spinner"

const startDate = ref("2020-07-01")
const endDate = ref("2020-07-01")
const limit = ref(10)

const { data: mostSoldProducts, isValidating: isMostSoldProductsValidating } = useMostSoldProducts(limit)
const { data: highestTurnoverProducts, isValidating: isHighestTurnoverProductsValidating } = useHighestTurnoverProducts(startDate, endDate, limit)
const { data: highestTurnoverVegetables, isValidating: isHighestTurnoverVegetablesValidating } = useHighestTurnoverVegetables(startDate, endDate, limit)
const { data: bestPerformingCategories, isValidating: isBestPerformingCategoriesValidating } = useBestPerformingCategories(startDate, endDate, limit)
const { data: highestLossRateProducts, isValidating: isHighestLossRateProductsValidating } = useHighestLossRateProducts(limit)
const { data: highestLossCostProducts, isValidating: isHighestLossCostProductsValidating } = useHighestLossCostProducts(startDate, endDate, limit)
const { data: productSales, isValidating: isProductSalesValidating } = useProductSales(startDate, endDate, limit)
const { data: productHealthBenefits, isValidating: isProductHealthBenefitsValidating } = useProductHealthBenefits(limit)

const busy = computed(() => isMostSoldProductsValidating.value || isHighestTurnoverProductsValidating.value || isHighestTurnoverVegetablesValidating.value || isBestPerformingCategoriesValidating.value || isHighestLossRateProductsValidating.value || isHighestLossCostProductsValidating.value || isProductSalesValidating.value || isProductHealthBenefitsValidating.value)
</script>


<template>
    <main class="min-h-screen bg-background">
        <section class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <div class="mb-6">
                <div class="flex gap-3 justify-between sm:items-center max-sm:flex-col-reverse">
                    <h1 class="text-3xl font-bold tracking-tight">Supermarket Manager Dashboard</h1>
                    <Badge v-if="busy" class="h-fit">
                        <Spinner />
                        Fetching
                    </Badge>
                </div>
                <p class="max-w-4xl text-base text-muted-foreground leading-6">
                    Actionable insights and trends for supermarket operations, sales, and product performance.
                </p>
            </div>

            <div class="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
                <div class="grid w-full max-w-sm items-center gap-1.5">
                    <Label for="email">Start Date</Label>
                    <Input v-model="startDate" type="date" />
                </div>
                <div class="grid w-full max-w-sm items-center gap-1.5">
                    <Label for="email">End Date</Label>
                    <Input v-model="endDate" type="date" />
                </div>
                <div class="grid w-full max-w-sm items-center gap-1.5">
                    <Label for="email">Limit</Label>
                    <Input v-model="limit" type="number" min="1" step="1" />
                </div>
            </div>

            <div class="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <OverviewCard title="Total Sales"
                    :value="formatCurrency(highestTurnoverProducts?.reduce((sum, row) => sum + row.turnover, 0))"
                    type="success" />
                <OverviewCard title="Total Loss"
                    :value="formatCurrency(highestLossCostProducts?.reduce((sum, row) => sum + row.losses, 0))"
                    type="danger" />
                <OverviewCard title="Top Product" :value="highestTurnoverProducts?.[0]?.productName || '-'"
                    type="default" />
                <OverviewCard title="Highest Loss Product" :value="highestLossCostProducts?.[0]?.productName || '-'"
                    type="default" />
            </div>



            <!-- Q2 & Q7: Highest Turnover Products and Sales by Product -->
            <div class="grid grid-cols-1 gap-6 xl:grid-cols-2 mb-6">
                <!-- Q2: Highest turnover products -->
                <Card class="border-border/80 bg-card/95 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle>Highest Turnover Products</CardTitle>
                        <CardDescription>
                            Products generating the highest revenue.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <BarChart :data="highestTurnoverProducts" xAxis="productName" yAxis="turnover"
                            :config="{ turnover: { label: 'Turnover', color: 'var(--chart-3)' } }" />
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Rank</TableHead>
                                    <TableHead>Product</TableHead>
                                    <TableHead>Turnover</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow v-for="(item, index) in highestTurnoverProducts"
                                    :key="`q2-${item.productName}`">
                                    <TableCell>#{{ index + 1 }}</TableCell>
                                    <TableCell>{{ item.productName }}</TableCell>
                                    <TableCell>{{ formatCurrency(item.turnover) }}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                <!-- Q7: Sales trend for date range -->
                <Card class="border-border/80 bg-card/95 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle>Sales by Product</CardTitle>
                        <CardDescription>
                            Sales performance by product for the selected period.
                        </CardDescription>
                    </CardHeader>
                    <CardContent class="space-y-4">
                        <BarChart :data="productSales" xAxis="productName" yAxis="sales"
                            :config="{ sales: { label: 'Sales (KG)', color: 'var(--chart-4)' } }" />
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Rank</TableHead>
                                    <TableHead>Product</TableHead>
                                    <TableHead>Sales (KG)</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow v-for="(item, index) in productSales" :key="`q7-${item.productName}`">
                                    <TableCell>#{{ index + 1 }}</TableCell>
                                    <TableCell>{{ item.productName }}</TableCell>
                                    <TableCell>{{ formatNumber(item.sales) }} kg</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            <!-- Q5 & Q6: Highest Loss Rates and Lost Revenue -->
            <div class="grid grid-cols-1 gap-6 xl:grid-cols-2 mb-6">
                <!-- Q5: Products with highest loss rates -->
                <Card class="border-border/80 bg-card/95 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle>Products with Highest Loss Rates</CardTitle>
                        <CardDescription>
                            Products with the highest loss rates.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <BarChart :data="highestLossRateProducts" xAxis="productName" yAxis="lossRate"
                            :config="{ lossRate: { label: 'Loss rate (%)', color: 'var(--chart-1)' } }" :yMax="100" />
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Product</TableHead>
                                    <TableHead>Loss rate (%)</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow v-for="row in highestLossRateProducts" :key="`q5-${row.productName}`">
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
                            Products contributing most to lost revenue.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <BarChart :data="highestLossCostProducts" xAxis="productName" yAxis="losses"
                            :config="{ losses: { label: 'Lost revenue', color: 'var(--chart-5)' } }" />
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Rank</TableHead>
                                    <TableHead>Product</TableHead>
                                    <TableHead>Lost revenue</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow v-for="(item, index) in highestLossCostProducts"
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

            <!-- Q3 & Q4: Vegetable and Category Performance -->
            <div class="grid grid-cols-1 gap-6 xl:grid-cols-2 mb-6">
                <!-- Q3: Vegetable performance -->
                <Card class="border-border/80 bg-card/95 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle>Vegetables with Highest Turnover</CardTitle>
                        <CardDescription>
                            Vegetables with the highest turnover.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <BarChart :data="highestTurnoverVegetables" xAxis="vegetableName" yAxis="turnover"
                            :config="{ veg: { label: 'Vegetable turnover', color: 'var(--chart-1)' } }" />
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Rank</TableHead>
                                    <TableHead>Vegetable</TableHead>
                                    <TableHead>Turnover</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow v-for="(item, index) in highestTurnoverVegetables"
                                    :key="`q3-${item.vegetableName}`">
                                    <TableCell>#{{ index + 1 }}</TableCell>
                                    <TableCell>{{ item.vegetableName }}</TableCell>
                                    <TableCell>{{ formatCurrency(item.turnover) }}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                <!-- Q4: Category performance -->
                <Card class="border-border/80 bg-card/95 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle>Category Performance</CardTitle>
                        <CardDescription>
                            Revenue and quantity sold by category.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <PieChart :data="bestPerformingCategories" label="categoryName" value="totalRevenue" :config="{
                            totalRevenue: { label: 'Total revenue', color: 'var(--chart-2)' }
                        }" />
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Revenue</TableHead>
                                    <TableHead>Quantity Sold</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow v-for="row in bestPerformingCategories" :key="`q4-${row.categoryName}`">
                                    <TableCell>{{ row.categoryName }}</TableCell>
                                    <TableCell>{{ formatCurrency(row.totalRevenue) }}</TableCell>
                                    <TableCell>{{ formatNumber(row.totalQuantity) }}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            <!-- Q1: Most Sold Products (KG) -->
            <div class="mb-6">
                <Card class="border-border/80 bg-card/95 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle>Most Sold Products (KG)</CardTitle>
                        <CardDescription>
                            Products with the highest sales volume.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <BarChart :data="mostSoldProducts" xAxis="productName" yAxis="sum"
                            :config="{ sum: { label: 'Sold KG', color: 'var(--chart-2)' } }" />
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Rank</TableHead>
                                    <TableHead>Product</TableHead>
                                    <TableHead>Sold (KG)</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow v-for="(item, index) in mostSoldProducts" :key="`q1-${item.productName}`">
                                    <TableCell>#{{ index + 1 }}</TableCell>
                                    <TableCell>{{ item.productName }}</TableCell>
                                    <TableCell>{{ formatNumber(item.sum) }} kg</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            <!-- Q8: Health benefits table -->
            <div class="mt-8">
                <Card class="border-border/80 bg-card/95 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle>Health Benefits per Product</CardTitle>
                        <CardDescription>
                            Health benefits associated with each product.
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
                                <TableRow v-for="row in productHealthBenefits" :key="`q8-${row.productName}`">
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
</template>
