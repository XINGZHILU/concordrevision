'use client';

import { Card } from "@chakra-ui/react"
import Link from "next/link"

export function PostCard({post} : {post : {title : string, id : number}}){
    return (
        <Card.Root size={'lg'}>
            <Card.Body gap="2">
                <Card.Title mt="2">{post.title}</Card.Title>
                <Link href={`/ec/${post.id}`}>View</Link>
            </Card.Body>
        </Card.Root>
    );
}