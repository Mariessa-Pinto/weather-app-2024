export default function Header() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className={`flex w-full justify-center items-end pt-5 md:pt-20`}>
            <div><p>&copy; {currentYear} Mariessa Pinto</p></div>
        </footer>
    )
}