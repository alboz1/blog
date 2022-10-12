import Link from 'next/link';
import styles from '../styles/Header.module.css';

export default function Header() {
    return (
        <header className={styles.header}>
            <h1>Blogger</h1>

            <nav className={styles.nav}>
                <Link href="/">Home</Link>
                <Link href="/login">Login</Link>
                <Link href="/signup">Sign Up</Link>
            </nav>
        </header>
    );
}