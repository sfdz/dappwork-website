import React from 'react';

type Bounty = {
    project: string,
    bountyState: number,
    issue: string,
    issueLink: string,
    owner: string,
    bountyAmount: string,
    bountyDuration: number,
    postedDate: string
    hunterGithubId: string
};

const [OPEN, AWAITING_CLAIM, CLOSED] = [0, 1, 2];

const defaultBounty: Bounty = {
        project: 'DAppWork',
        bountyState: OPEN,
        issue: 'Add github link to bounty titles',
        issueLink: 'https://github.com/',
        bountyAmount: '.005 WETH',
        postedDate: '2022-05-05',
        bountyDuration: 60 * 60 * 24 * 7,
        hunterGithubId: 'DDDDDDDDDDDDDD',
        owner: '0xFFFFFFFFFFFFFF'
};

const BountyDetail = () => {
    return (
        <>
            <h2>{defaultBounty.issue}</h2>
            <ul>
                <li>issue url: {defaultBounty.issueLink}</li>
                <li>bounty duration: {defaultBounty.bountyDuration}</li>
                <li>bounty amount: {defaultBounty.bountyAmount}</li>
            </ul>
        </>
    );
};

export default BountyDetail;