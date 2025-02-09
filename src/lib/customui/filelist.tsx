import Link from "next/link";

export default function FileList({files}: {
    files: {
        id: number;
        filename: string;
        path: string;
    }[]
}) {
    return (<div>
        {files.map((file) => {
            return <div key={file.id} >
                <Link href={`/fileview/${file.id}`}>{file.filename}</Link>
                <br/>
            </div>;
        })}
    </div>);
}