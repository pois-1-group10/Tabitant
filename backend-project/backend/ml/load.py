import logging
from transformers import (
    AutoConfig,
    AutoModelForSequenceClassification,
    AutoTokenizer,
    pipeline,
)

logger = logging.getLogger(__name__)

pipe = None

def load():
    global pipe
    if pipe: return
    model_name = "y-aut/utakai-emotion-tag"
    config = AutoConfig.from_pretrained(model_name)
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModelForSequenceClassification.from_pretrained(model_name, config=config)
    pipe = pipeline("text-classification", model=model, tokenizer=tokenizer, top_k=None)

def get_pipe():
    if pipe is None:
        logger.warning("The model is not loaded. Now loading...")
        load()
    return pipe

def main():
    load()
    print(pipe("寂しい"))

if __name__ == "__main__":
    main()
