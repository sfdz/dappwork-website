import React from 'react';
import { FieldValues, FormState, useForm, UseFormGetValues } from 'react-hook-form';

enum FormStep {
    IssueURL,
    BountyDuration,
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
        case FormStep.BountyDuration:
            prevStep = FormStep.IssueURL;
            break;
        case FormStep.BountyAmount:
            prevStep = FormStep.BountyDuration;
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
            nextStep = FormStep.BountyDuration;
            break;
        case FormStep.BountyDuration:
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

    const bountyDuration = values["bountyDuration"];
    if (!bountyAmount) {
        return renderInternalError();
    }

    const [orgName, repoName] = [match[1], match[2]];
    return (
        <ul>
            <li>organization: {orgName}</li>
            <li>repo: {repoName}</li>
            <li>issue url: {issueURL}</li>
            <li>bounty duration: {bountyDuration}</li>
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
                <h2>issue url pls</h2>
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
            {formStep === FormStep.BountyDuration && <section>
                <h2>bounty duration pls</h2>
                <p>Choose how long the funds will be locked up <i>for you</i>. You will not be able to withdraw funds for this amount of time.</p>
                <p>After this lockup period has passed, you may close the bounty and withdraw the funds.</p>
                <p>If a developer resolves your issue, they can claim the bounty in a matter of minutes, regardless of the lockup period.</p>
                <p>Developers may still submit solutions to your bounty when the lockup has expired, but they may not want to do the work if you can close the bounty at any time.</p>
                <label>
                    <input
                        type="radio"
                        value="1 week"
                        id="field-1-week"
                        {...register("bountyDuration")}
                    />
                    1 week
                </label>
                
                <label>
                    <input
                        type="radio"
                        value="2 weeks"
                        id="field-2-weeks"
                        {...register("bountyDuration")}
                    />
                    2 weeks
                </label>
                
                <label>
                    <input
                        type="radio"
                        value="4 weeks"
                        id="field-4-weeks"
                        {...register("bountyDuration")}
                    />
                    4 weeks
                </label>

                <label>
                    <input
                        type="radio"
                        value="8 weeks"
                        id="field-8-weeks"
                        {...register("bountyDuration")}
                    />
                    8 weeks
                </label>
            </section>}
            {formStep === FormStep.BountyAmount && <section>
                <h2>bounty amount pls</h2>
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
                <h2>here's your bounty preview</h2>
                {renderPreview(getValues, formState)}
            </section>}
            {formStep === FormStep.BountyCreated && <section>
                <h2>your bounty was created</h2>
            </section>}
            {renderBackButton(formStep, setFormStep)}
            {renderNextButton(formStep, setFormStep, formState.isValid)}
        </form>
    );
}

export default NewBounty;
