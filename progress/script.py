import requests
import matplotlib.pyplot as plt
import seaborn as sns
from collections import Counter

# Hent data fra API
url = "http://192.168.0.37:3000/api"
response = requests.get(url)

if response.status_code == 200:
    data = response.json()  # Antager at API'et returnerer JSON
else:
    print("Fejl ved hentning af data:", response.status_code)
    exit()

# Udtræk moneysum og korrekte svar
moneysums = [item["moneysum"] for item in data]
correct_answers = [item["correct_answer"] for item in data]

# Tæl antal spørgsmål pr. præmiesum
count_moneysums = Counter(moneysums)
sorted_sums = sorted(count_moneysums.keys())
counts = [count_moneysums[m] for m in sorted_sums]

# Tæl forekomsten af de korrekte svar (A, B, C, D)
answer_counts = Counter(correct_answers)
answer_labels = sorted(answer_counts.keys())  # Sørg for, at labels er i A, B, C, D orden
answer_values = [answer_counts[a] for a in answer_labels]

# Opsætning af grafstil
sns.set(style="darkgrid")
fig, axes = plt.subplots(1, 2, figsize=(14, 5))

# 1️⃣ Fordeling af spørgsmål efter præmiesum
sns.barplot(x=sorted_sums, y=counts, palette="viridis", ax=axes[0])
axes[0].set_xlabel("Præmiesum (DKK)")
axes[0].set_ylabel("Antal spørgsmål")
axes[0].set_title("Fordeling af spørgsmål efter præmiesum")
axes[0].set_xticklabels(sorted_sums, rotation=45)

# 2️⃣ Fordeling af de korrekte svar (A, B, C, D)
sns.barplot(x=answer_labels, y=answer_values, palette="coolwarm", ax=axes[1])
axes[1].set_xlabel("Korrekt svar")
axes[1].set_ylabel("Antal gange valgt")
axes[1].set_title("Fordeling af korrekte svar")

# Vis graferne
plt.tight_layout()
plt.show()