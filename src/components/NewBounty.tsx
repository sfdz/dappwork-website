import React from 'react';

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

const renderNextButton = (formStep: FormStep, setFormStep: any) => {
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
            onClick={() => {setFormStep(nextStep)}}
            type='button'
        >
            next
        </button>);
}

const NewBounty = () => {
    const [formStep, setFormStep] = React.useState(FormStep.IssueURL);

    return (
        <form>
            {formStep === FormStep.IssueURL && <section>
                <p>issue url pls</p>
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
            {renderBackButton(formStep, setFormStep)}
            {renderNextButton(formStep, setFormStep)}
        </form>
    );
}

export default NewBounty;
