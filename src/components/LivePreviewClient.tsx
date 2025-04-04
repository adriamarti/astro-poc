import { useEffect, useState } from 'react';
import { enableVisualEditing } from '@sanity/visual-editing';
import { sanity } from '../lib/sanityClient';
import { renderPortableText } from '../utils/renderPortableText';

type Post = {
  title: string;
  mainImage?: { asset?: { url: string } };
  body?: any[];
};

export default function LivePreviewClient() {
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    enableVisualEditing();

    const slug = new URLSearchParams(window.location.search).get('slug');
    if (!slug) return;

    const sub = sanity
      .listen(`*[_type == "post" && slug.current == $slug][0]._rev`, { slug })
      .subscribe(() => {
        // Re-fetch full data with asset URL
        sanity
          .fetch(
            `*[_type == "post" && slug.current == $slug][0]{
          title,
          body,
          mainImage {
            asset -> {
              url
            }
          }
        }`,
            { slug }
          )
          .then((data) => {
            setPost(data as Post);
          });
      });

    return () => sub.unsubscribe();
  }, []);

  if (!post) return <p>Loading preview...</p>;

  const htmlBody = post.body ? renderPortableText(post.body) : '';

  return (
    <main className='p-8 max-w-3xl mx-auto'>
      <h1 className='text-4xl font-bold mb-6'>{post.title}</h1>

      {post.mainImage?.asset?.url && (
        <img
          src={`${post.mainImage.asset.url}?auto=format&fit=max&w=800`}
          width='800'
          height='400'
          alt={post.title}
          loading='lazy'
          className='w-full h-64 object-cover rounded-xl mb-6'
        />
      )}

      <article dangerouslySetInnerHTML={{ __html: htmlBody }} />
    </main>
  );
}
