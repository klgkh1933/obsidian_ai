**CIA triad** means:: **Confidentiality**, **Integrity**, **Availability**.

| Property            | AI meaning                                                                                             | Example                                                                                               |
| ------------------- | ------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------- |
| **Confidentiality** | Protect training data, prompts, user input, outputs, weights and secrets from unauthorized disclosure. | Membership inference, [[Concepts/Model Inversion\|model inversion]], stolen model, data exfiltration. |
| **Integrity**       | Preserve intended model behavior, input evidence and accuracy of decisions.                            | Poisoning, adversarial evasion, prompt injection, compromised outputs.                                |
| **Availability**    | Preserve service use and manage resource/cost limits.                                                  | Denial of service and **denial of wallet** (deliberate inference-cost inflation).                     |

A single attack can affect several properties. An indirect injection that changes an answer **and** sends a private document externally impacts both **integrity** and **confidentiality**.

**Denial of wallet**: Abusing a costly AI endpoint to generate bills rather than, or in addition to, making the service unavailable.