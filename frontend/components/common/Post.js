import Link from 'next/link';
import styles from '../../styles/Post.module.css';

export default function Post({ title, body, date, slug }) {
    return (
        <article className={styles.post}>
            <header>
                <h3>{ title }</h3>
            </header>
            <p>{ body }</p>
            <footer>
                <small>{date}</small>
                <Link href={slug}>Read More</Link>
            </footer>
        </article>
    );
}