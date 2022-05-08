import React from 'react';

type ClaimBountyProps = {
    githubUsername: string,
}

const ClaimBounty = (props: ClaimBountyProps) => {
    return (
        <>
            <h2>claim the bounty</h2>
            <p>The Github user credited with resolving the issue is {props.githubUsername}</p>
            <p>Use the 'Log in with GitHub' button so we can validate that the account is yours</p>
            <button>Log in with GitHub</button>
        </>
    );
}

export default ClaimBounty;
