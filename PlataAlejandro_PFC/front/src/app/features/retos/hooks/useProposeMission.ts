import { useState } from 'react';
import { challengesService } from '../services/challengesService';
import { useDraft, clearDraft } from '../../../hooks/useDraft';

interface ProposeMissionState {
    title: string;
    description: string;
    instructions: string;
    expectedOutput: string;
    language: string;
    difficulty: 'Fácil' | 'Intermedio' | 'Difícil';
    initialCode: string;
    solutionCode: string;
    validationCode: string;
}

const INITIAL_STATE: ProposeMissionState = {
    title: '',
    description: '',
    instructions: '',
    expectedOutput: '',
    language: 'javascript',
    difficulty: 'Fácil',
    initialCode: '',
    solutionCode: '',
    validationCode: '',
};

export const useProposeMission = (onSuccess?: () => void) => {
    const [fields, setFields] = useState<ProposeMissionState>(INITIAL_STATE);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    useDraft('propose-mission', fields, setFields);

    const setField = <K extends keyof ProposeMissionState>(key: K, value: ProposeMissionState[K]) => {
        setFields(prev => ({ ...prev, [key]: value }));
    };

    const reset = () => {
        setFields(INITIAL_STATE);
        setSubmitted(false);
        clearDraft('propose-mission');
    };

    const canSubmit = fields.title.trim().length > 0 && fields.description.trim().length > 0;

    const handleSubmit = async () => {
        if (!canSubmit || isSubmitting) return;
        setIsSubmitting(true);
        try {
            await challengesService.proposeChallenge({
                title: fields.title.trim(),
                description: fields.description.trim(),
                instructions: fields.instructions.trim(),
                expected_output: fields.expectedOutput.trim(),
                language: fields.language,
                difficulty: fields.difficulty,
                starter_code: fields.initialCode,
                solution_code: fields.solutionCode,
                test_code: fields.validationCode,
            });
            clearDraft('propose-mission');
            setSubmitted(true);
            onSuccess?.();
        } catch {
            // Error silencioso — se puede añadir toast en el futuro
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        fields,
        setField,
        isSubmitting,
        submitted,
        canSubmit,
        handleSubmit,
        reset,
    };
};
