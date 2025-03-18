import { Button, Card } from "@chakra-ui/react"
import Link from "next/link"

export function PostCard({post} : {post : {title : string, id : number}}){
    return (
        <Card.Root size={'lg'}>
            <Card.Body gap="2">
                <Card.Title mt="2">{post.title}</Card.Title>
            </Card.Body>
            <Card.Footer justifyContent="flex-end">
                <Button variant="outline" asChild><Link href={`/ec/${post.id}`}>View</Link>View</Button>
            </Card.Footer>
        </Card.Root>
    )
}