export type PatientInfo = {
  name: string;
  guardianName: string;
  age: string;
  reference: string;
};

export const emptyPatientInfo: PatientInfo = {
  name: "",
  guardianName: "",
  age: "",
  reference: "",
};

/**
 * Reference is intentionally excluded — it's optional everywhere it's used.
 */
export function patientInfoIsValid(values: PatientInfo): boolean {
  const age = Number(values.age);
  return (
    values.name.trim().length > 0 &&
    values.guardianName.trim().length > 0 &&
    Number.isFinite(age) &&
    age > 0 &&
    age < 130
  );
}
