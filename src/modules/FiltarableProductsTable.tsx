import { ReactNode } from "react"
import { useState } from "react"

import { Product } from "../types/Product"

type ProductCategoryRowProp = { category: string };

function ProductCategoryRow({ category }: ProductCategoryRowProp) {
    return (
        <tr>
            <th colSpan={2}>
                {category}
            </th>
        </tr>
    )
}


type ProductRowProp = { product: Product }

function ProductRow({ product }: ProductRowProp) {
    const name = product.stocked ? product.name :
        <span style={{ color: "red" }}>
            {product.name}
        </span>

    return (
        <tr>
            <td>{name}</td>
            <td>{product.price}</td>
        </tr>
    )
}

type ProductTableProp = {
    products: Array<Product>,
    filterText: string | undefined,
    inStockOnly: boolean | undefined
}

function ProductTable({ products, filterText, inStockOnly }: ProductTableProp) {
    const rows: Array<ReactNode> = [];
    let lastCategory: string | null = null;

    if (typeof filterText !== "string") { return }

    products.forEach((product: Product) => {
        if (product.name.toLowerCase().indexOf(filterText.toLowerCase()) === -1) { return };

        if (inStockOnly && !product.stocked) { return };

        if (product.category !== lastCategory) {
            rows.push(
                <ProductCategoryRow
                    category={product.category}
                    key={product.category} />
            );
        }

        rows.push(
            <ProductRow
                product={product}
                key={product.name} />
        );

        lastCategory = product.category;
    })

    return (
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Price</th>
                </tr>
            </thead>
            <tbody>{rows}</tbody>
        </table>
    );
}

type SearchBarProp = {
    filterText: string | undefined,
    inStockOnly: boolean | undefined,
    onFilterTextChange: UseStateSetter<string | undefined>,
    onInStockOnlyChange: UseStateSetter<boolean | undefined>
}

function SearchBar({ filterText, inStockOnly, onFilterTextChange, onInStockOnlyChange }: SearchBarProp) {
    return (
        <form>
            <input
                type={"text"}
                value={filterText}
                placeholder="search..."
                onChange={(e) => onFilterTextChange(e.target.value)} />

            <label>
                <input
                    type={"checkbox"}
                    checked={inStockOnly}
                    onChange={(e) => onInStockOnlyChange(e.target.checked)} />
                {" "}
                Only show products in stock
            </label>
        </form>
    );
}

type UseStateSetter<t,> = React.Dispatch<React.SetStateAction<t>>

type FiltarableProductsTableProp = { products: Array<Product> }

export default function FiltarableProductsTable({ products }: FiltarableProductsTableProp): ReactNode {
    const [filterText, setFilterText] = useState<string>();
    const [inStockOnly, setInStockOnly] = useState<boolean>();
    return (
        <div>
            <SearchBar
                filterText={filterText}
                inStockOnly={inStockOnly}
                onFilterTextChange={setFilterText}
                onInStockOnlyChange={setInStockOnly} />
            <ProductTable
                products={products}
                filterText={filterText}
                inStockOnly={inStockOnly} />
        </div>
    )
}