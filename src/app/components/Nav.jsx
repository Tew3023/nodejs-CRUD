import Link from "next/link"
export default function Nav(){
    return(
        <nav className="flex justify-center mb-2 shadow-md py-3 bg-white">
            <Link href='/' className="mx-2">Cards</Link>
            <Link href='/cart' className="mx-2">Cart</Link>
        </nav>
    )
}