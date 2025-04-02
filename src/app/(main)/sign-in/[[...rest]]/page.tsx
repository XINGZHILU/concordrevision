import { SignIn } from '@clerk/nextjs'

export default function Page() {
    return <div className={'place-items-center'}>
        <SignIn />
    </div>
}