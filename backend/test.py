report = """
```json
{
  "Patient Name": "Tejaswini",
  "Age": "21",
  "Gender": "Female",
  "Report Date": "October 26, 2023",
  "Summary of the diagnosis": "This report addresses the concerning MRI results indicating mild dementia in a 21-year-old female patient, Tejaswini.  At this age, dementia is exceedingly rare and requires extensive further investigation to determine the underlying cause. The diagnosis of 'mild dementia' based solely on an MRI is preliminary and requires confirmation through additional neurological assessments, cognitive testing (e.g., Mini-Mental State Examination, MMSE), and potentially genetic testing.  Further investigation is crucial to rule out other conditions that might mimic dementia symptoms.",
  "Possible causes and risk factors": "Given Tejaswini's young age, the presence of dementia is highly unusual.  Possible causes that need to be explored include:\n\n* **Rare genetic forms of dementia:**  Early-onset Alzheimer's disease or other genetic dementias are possibilities, although extremely rare at this age.  Genetic testing is strongly recommended.\n* **Frontotemporal Dementia (FTD):** This type of dementia can manifest at a younger age than Alzheimer's disease.\n* **Other neurological conditions:**  Conditions like stroke, brain tumors, head injuries, or infections can sometimes present with dementia-like symptoms.  Further neuroimaging (e.g., more detailed MRI, CT scan) may be necessary.\n* **Metabolic disorders:** Certain metabolic disorders can affect brain function and potentially mimic dementia symptoms.\n* **Psychiatric disorders:**  While unlikely to fully explain the MRI findings, conditions like severe depression or other psychiatric illnesses could contribute to cognitive decline and should be ruled out.\n* **Medication side effects:** Certain medications can have cognitive impairment as a side effect.\n\nRisk factors considered:  Family history of dementia (reported as 'Yes') is a significant concern that requires thorough genetic evaluation. The patient's exercise habits ('Sometimes') and diet ('Healthy') seem largely irrelevant at this stage given the atypical presentation.",
  "Lifestyle and medical recommendations": "Given the unusual presentation, immediate and comprehensive medical evaluation is crucial.  This should include:\n\n* **Neurological examination:** By a neurologist specializing in cognitive disorders.\n* **Comprehensive cognitive testing:** To assess cognitive function and identify specific deficits.\n* **Blood tests:** To rule out metabolic disorders and infections.\n* **Genetic testing:** To screen for early-onset dementia-causing genes.\n* **Advanced neuroimaging:**  Including potentially PET scans or specialized MRI sequences to look for specific patterns consistent with different types of dementia.\n* **Review of current medications:** To assess for any potential drug interactions or side effects.\n* **Psychiatric evaluation:** To rule out any underlying psychiatric conditions.\n* **Lifestyle adjustments:** While the impact of lifestyle modifications is unclear given the uncertain diagnosis, maintaining a healthy diet and engaging in regular exercise is always recommended.",
  "Long-term care suggestions": "Long-term care planning at this stage is premature and depends entirely on the definitive diagnosis.  Once a diagnosis is established, a tailored care plan addressing specific needs will be developed. This could range from supportive therapies to more intensive long-term care if the condition progresses significantly.",
  "Emotional and psychological support": "This situation is undoubtedly stressful for Tejaswini and her family. Access to counseling and support groups is highly recommended. Psychological support can help manage anxiety, depression, and cope with the uncertainty surrounding the diagnosis.  A multidisciplinary approach involving neurologists, psychiatrists, genetic counselors, and social workers can provide holistic care and support."
}
```"""

import re
import ast


def ret_dict(report):
    di = {}
    report  = str(report).replace("```","").replace('json',"").replace("*","").replace("\n","")
    report = ast.literal_eval(report)
    all_keys = list(report.keys())
    di['name'] = report[all_keys[0]]
    di['age'] = report[all_keys[1]]
    di['gender'] = report[all_keys[2]]
    di['report_date'] = report[all_keys[3]]
    di['Summary of the diagnosis'] = report[all_keys[4]]
    di['Possible causes and risk factors'] = report[all_keys[5]]
    di['Lifestyle and medical recommendations'] = report[all_keys[6]]
    di['Long-term care suggestions'] = report[all_keys[7]]
    di['Emotional and psychological support'] = report[all_keys[8]]
    return di
# di = ret_dict(report)
# print(di)
