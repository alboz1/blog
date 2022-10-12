import useSwr from 'swr';
import Post from "./common/Post";
import styles from '../styles/Main.module.css';

import API, { fetcher } from '../API';

export default function Main() {
    const { data, error } = useSwr(API.GET_HOME_POSTS, fetcher);
    console.log(data);
    if (error) return <p>{error.info || error.message}</p>
    if (!data) return <p>Loading...</p>

    return (
        <main className={styles.main}>
            {
                data.map(post => {
                    return <Post
                        key={post.id}
                        title={post.title}
                        body={post.body}
                        date={post.created_at}
                        slug={post.slug}
                    />
                })
            }
        </main>
    );
}