import React from 'react';
import { FieldValues, FormState, useForm, UseFormGetValues } from 'react-hook-form';

enum FormStep {
    IssueURL,
    BountyAmount,
    BountyPreview,
    BountyCreated,
}

const renderBackButton = (formStep: FormStep, setFormStep: any) => {
    if (formStep === FormStep.IssueURL || formStep === FormStep.BountyCreated) {
        return undefined;
    }
    var prevStep: FormStep;
    switch (formStep) {
        case FormStep.BountyAmount:
            prevStep = FormStep.IssueURL;
            break;
        case FormStep.BountyPreview:
            prevStep = FormStep.BountyAmount;
            break;
    }
    return (
        <button
            onClick={() => {setFormStep(prevStep)}}
            type='button'
        >
            back
        </button>);
}

const renderNextButton = (formStep: FormStep, setFormStep: any, isValid: boolean) => {
    if (formStep === FormStep.BountyCreated) {
        return undefined;
    }
    var nextStep: FormStep;
    switch (formStep) {
        case FormStep.IssueURL:
            nextStep = FormStep.BountyAmount;
            break;
        case FormStep.BountyAmount:
            nextStep = FormStep.BountyPreview;
            break;
        case FormStep.BountyPreview:
            nextStep = FormStep.BountyCreated;
            break;
    }
    return (
        <button
            disabled={!isValid}
            onClick={() => {setFormStep(nextStep)}}
            type='button'
        >
            next
        </button>);
}

const issueURLPattern = /^https:\/\/github.com\/([^-][^/]{0,38})\/([-_.A-Za-z0-9]{1,100})\/issues\/\d{1,10}\/?$/;

const validateIssueURL = (url: string) => {
    return url.match(issueURLPattern) !== null;
}

const renderInternalError = () => {
    return <p>Something went wrong. Please try again later.</p>;
}

const renderPreview = (getValues: UseFormGetValues<FieldValues>, formState: FormState<FieldValues>) => {
    // A lot of this validation should have already occurred
    if (!formState.isValid) {
        return renderInternalError();
    }

    const values = getValues();
    const issueURL = values["issueURL"];
    if (!issueURL) {
        return renderInternalError();
    }

    const match = issueURL.match(issueURLPattern);
    if (match === null) {
        return renderInternalError();
    }

    const bountyAmount = values["bountyAmount"];
    if (!bountyAmount) {
        return renderInternalError();
    }

    const [orgName, repoName] = [match[1], match[2]];
    return (
        <ul>
            <li>organization: {orgName}</li>
            <li>repo: {repoName}</li>
            <li>issue url: {issueURL}</li>
            <li>bounty amount: {bountyAmount}</li>
        </ul>
    );
}

const NewBounty = () => {
    const [formStep, setFormStep] = React.useState(FormStep.IssueURL);
    const { getValues, register, formState } = useForm({
        mode: 'all'
    });

    return (
        <form>
            {formStep === FormStep.IssueURL && <section>
                <p>issue url pls</p>
                <input
                    type="text"
                    id="issue_url"
                    className="text-input"
                    autoComplete="off"
                    {...register("issueURL", {
                        validate: validateIssueURL,
                      })}
                />
            </section>}
            {formStep === FormStep.BountyAmount && <section>
                <p>bounty amount pls</p>
                <input
                    type="number"
                    id="bounty_amount"
                    autoComplete="off"
                    {...register("bountyAmount", {
                        required: true,
                        min: .001,
                    })}
                />
            </section>}
            {formStep === FormStep.BountyPreview && <section>
                <p>here's your bounty preview</p>
                {renderPreview(getValues, formState)}
            </section>}
            {formStep === FormStep.BountyCreated && <section>
                <p>your bounty was created</p>
            </section>}
            {renderBackButton(formStep, setFormStep)}
            {renderNextButton(formStep, setFormStep, formState.isValid)}
        </form>
    );
}

export default NewBounty;
