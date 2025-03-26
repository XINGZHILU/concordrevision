export default function FileList({files}: {
    files: {
        id: number;
        filename: string;
        path: string;
    }[]
}) {
    /*
    return (<div className={'gap-y-6'}>
        {files.map((file) => {
            return <div key={file.id}>
                <h3>
                    <Link href={`/fileview/pdf/${file.id}`}
                        className={'p-2 border-solid border-gray-500 border-2 rounded-lg'}>
                            {file.filename}</Link>
                </h3>
                <br />

            </div>;
        })}
    </div>);
     */
    return (<div className={'gap-y-6'}>
        {files.length === 0 ? (
            <p>No files found</p>
        ) : (
            files.map((file) => {
                return <div key={file.id}>
                    <h3>
                        <a className={'p-2 border-solid border-gray-500 border-2 rounded-lg'}
                           href={file.path} target="_blank" rel="noopener noreferrer">
                            {file.filename}
                        </a>
                    </h3>
                    <br/>

                </div>;
            })
        )}
    </div>);

}