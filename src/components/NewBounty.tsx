import React from 'react';
import { useForm } from 'react-hook-form';

enum FormStep {
    IssueURL,
    BountyAmount,
    BountyPreview,
    BountyCreated,
}

const renderBackButton = (formStep: FormStep, setFormStep: any, isValid: boolean) => {
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
            disabled={!isValid}
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

const NewBounty = () => {
    const [formStep, setFormStep] = React.useState(FormStep.IssueURL);
    const { watch, register, formState } = useForm({
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
                    {...register("test", {
                        required: true,
                        pattern: /^https:\/\/github.com\/[^-][^/]{0,38}\/[-_.A-Za-z0-9]{1,100}\/issues\/\d{1,10}\/?$/
                      })}
                />
            </section>}
            {formStep === FormStep.BountyAmount && <section>
                <p>bounty amount pls</p>
            </section>}
            {formStep === FormStep.BountyPreview && <section>
                <p>here's your bounty preview</p>
            </section>}
            {formStep === FormStep.BountyCreated && <section>
                <p>your bounty was created</p>
            </section>}
            {renderBackButton(formStep, setFormStep, formState.isValid)}
            {renderNextButton(formStep, setFormStep, formState.isValid)}
        </form>
    );
}

export default NewBounty;
