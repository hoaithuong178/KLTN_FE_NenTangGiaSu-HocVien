// src/pages/Sitemap.tsx (for dynamic generation)
import { useEffect } from 'react';
import axiosClient from '../configs/axios.config';
import { ITutor } from '../interfaces';
import { IPost } from '../interfaces/post.interface';

const Sitemap = () => {
    useEffect(() => {
        const generateSitemap = async () => {
            try {
                // Fetch necessary data
                const [tutors, posts] = await Promise.all([
                    axiosClient.get('/tutors/search'),
                    axiosClient.get('/posts'),
                ]);

                // Generate XML
                const xml = `<?xml version="1.0" encoding="UTF-8"?>
                    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
                    <url>
                        <loc>${window.location.origin}</loc>
                        <changefreq>daily</changefreq>
                        <priority>1.0</priority>
                    </url>
                    <url>
                        <loc>${window.location.origin}/tutors</loc>
                        <changefreq>daily</changefreq>
                        <priority>0.8</priority>
                    </url>
                    ${tutors.data
                        .map(
                            (tutor: ITutor) => `
                    <url>
                        <loc>${window.location.origin}/tutor-profile/${tutor.id}</loc>
                        <changefreq>weekly</changefreq>
                        <priority>0.7</priority>
                    </url>
                    `,
                        )
                        .join('')}
                    ${posts.data
                        .map(
                            (post: IPost) => `
                    <url>
                        <loc>${window.location.origin}/post/${post.id}</loc>
                        <changefreq>weekly</changefreq>
                        <priority>0.6</priority>
                    </url>
                    `,
                        )
                        .join('')}
                    </urlset>`;

                // Set content type and send response
                document.open('text/xml');
                document.write(xml);
                document.close();
            } catch (error) {
                console.error('Error generating sitemap:', error);
            }
        };

        generateSitemap();
    }, []);

    return null;
};

export default Sitemap;
