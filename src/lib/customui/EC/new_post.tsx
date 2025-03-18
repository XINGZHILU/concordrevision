// @ts-nocheck

'use client';

import React, {useRef} from "react";
import MDEditor from '@uiw/react-md-editor';
import {toaster} from "@/components/ui/toaster"
import {Alert, Button} from "@chakra-ui/react";

export default function PostForm({author}: { author: string }) {
    const [value, setValue] = React.useState("");
    const titleRef = useRef<HTMLInputElement>(null);

    async function submit(event: React.FormEvent) {
        event.preventDefault();

        if (value === "") {
            alert("Post content cannot be empty");
            return;
        }

        const title = titleRef.current?.value || 'No title';

        const response = await fetch('/api/add_post', {
            method: 'POST',
            body: JSON.stringify({
                author: author,
                content: value,
                title: title
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            toaster.error({
                title: "Failed to upload post",
                description: "Please try again later"
            });
        } else {
            toaster.success({
                title: "Post uploaded",
                description: "Your post has been uploaded"
            });
        }

        setValue("");
    }


    return (
        <div className="container w-full">
            <form onSubmit={submit}>
                <label htmlFor={'title'}>Title: </label>
                <input type="text" ref={titleRef} name={'title'} placeholder={'Enter the title of the post'}
                       required={true}/> <br/>

                <MDEditor value={value} onChange={setValue}/>
                <Button colorPalette={'blue'} type="submit">Post</Button>
            </form>
            <Alert.Root status="warning">
                <Alert.Indicator/>
                <Alert.Title>
                    Click <a href={'https://www.markdownguide.org/basic-syntax/'}><b>here</b></a> for how to format your
                    post
                </Alert.Title>
            </Alert.Root>
        </div>
    );
}