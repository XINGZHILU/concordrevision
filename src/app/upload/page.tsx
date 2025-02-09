import Link from "next/link";


export default function Page() {


    return <div>
        <Link href={`/upload/revision/`}>Revision resources</Link><br/>
        <Link href={`/upload/olympiads/`}>Olympiad resources</Link><br/>
    </div>;
}