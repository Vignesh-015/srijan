import time
import numpy as np

# Categories for the support system
CANDIDATE_LABELS = [
    "login", "network", "database", "hardware",
    "billing", "access", "software", "email",
    "security", "performance", "refund", "subscription",
]

# Prototype sentences for each category to improve semantic matching
LABEL_PROTOTYPES = {
    "login": ["I cannot log in to my account", "password reset needed", "login issues"],
    "network": ["internet is down", "connection failed", "slow wifi", "port blocked"],
    "database": ["query failed", "data not found", "database connection error"],
    "hardware": ["broken screen", "laptop won't turn on", "printer not working"],
    "billing": ["invoice question", "payment failed", "billing error", "overcharged"],
    "access": ["permission denied", "cannot access folder", "request access"],
    "software": ["app keeps crashing", "bug report", "installation error"],
    "email": ["emails not sending", "cannot receive mail", "outlook error"],
    "security": ["compromised account", "suspicious activity", "virus scan"],
    "performance": ["system is slow", "lagging", "high CPU usage"],
    "refund": ["want a refund", "requesting money back", "return item"],
    "subscription": ["cancel subscription", "upgrade plan", "membership renewal"],
}

_label_embeddings = None


def _get_label_embeddings():
    """Cache the embeddings for our category labels."""
    global _label_embeddings
    if _label_embeddings is None:
        from app.agents.retrieval_agent import get_model
        model = get_model()
        
        print("[ClassifierAgent] Encoding category prototypes for semantic matching...")
        embeddings = {}
        for label, prototypes in LABEL_PROTOTYPES.items():
            # Combine label and prototypes for better semantic representation
            combined_texts = [label] + prototypes
            embs = model.encode(combined_texts, normalize_embeddings=True)
            # Average the embeddings for a single prototype vector
            embeddings[label] = np.mean(embs, axis=0)
        
        _label_embeddings = embeddings
        print("[ClassifierAgent] Category prototypes encoded.")
    return _label_embeddings


def classify_ticket(text: str) -> dict:
    """Classify a support ticket using semantic similarity to category prototypes."""
    start = time.time()
    
    from app.agents.retrieval_agent import get_model
    model = get_model()
    label_embs_dict = _get_label_embeddings()
    
    # 1. Embed the input text
    query_emb = model.encode([text], normalize_embeddings=True)
    
    # 2. Compare against all category embeddings
    labels = list(label_embs_dict.keys())
    prototype_matrix = np.array([label_embs_dict[l] for l in labels])
    
    # Since embeddings are normalized, cosine similarity is just the dot product
    # query_emb shape: (1, 384), prototype_matrix shape: (12, 384)
    similarities = np.dot(query_emb, prototype_matrix.T)[0]
    
    # 3. Sort results
    all_predictions = []
    for label, score in zip(labels, similarities):
        all_predictions.append({"label": label, "score": round(float(score), 4)})
    
    all_predictions.sort(key=lambda x: x["score"], reverse=True)
    
    top_pred = all_predictions[0]
    elapsed = round(time.time() - start, 3)

    return {
        "agent": "ClassifierAgent (Semantic)",
        "category": top_pred["label"],
        "confidence": top_pred["score"],
        "all_predictions": all_predictions[:5],
        "execution_time_ms": int(elapsed * 1000),
        "status": "completed",
    }
