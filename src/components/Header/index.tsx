import Image from "next/image"

export default function Header() {
    return (
        <header className={`flex flex-col md:flex-row bg-opacity-50 bg-light-purple w-full rounded-md p-8 sm:items-center md:items-end justify-center gap-10`}>
            <Image
                src={`/logo.svg`}
                alt='logo'
                height={100}
                width={250}
            />
            <h2 className={`text-5xl font-medium mr-0 md:mr-40 pb-2`}>Weather App</h2>
        </header>
    )
}