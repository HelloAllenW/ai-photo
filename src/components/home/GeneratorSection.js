import Image from "next/image";
import { FaCrown, FaDownload, FaImage } from "react-icons/fa";
import { STYLE_OPTIONS } from "@/lib/image-generation";
import styles from "@/app/page.module.css";

export default function GeneratorSection({
  isSubscribed,
  freeRemaining,
  prompt,
  setPrompt,
  style,
  setStyle,
  onReferenceImageChange,
  referenceImageName,
  generating,
  onGenerate,
  checkoutLoading,
  onSubscribe,
  generatedImageUrl,
}) {
  return (
    <section className={styles.generatorCard}>
      <div className={styles.panelHeader}>
        <div>
          <p className={styles.cardLabel}>AI image generator</p>
          <h2>Generate a new styled image</h2>
        </div>
        <div className={styles.usageBadge}>
          {isSubscribed ? "订阅有效 · 无限生成" : `剩余 ${freeRemaining} 次`}
        </div>
      </div>

      <div className={styles.generatorGrid}>
        <div className={styles.formColumn}>
          <label className={styles.field}>
            <span>Prompt</span>
            <textarea
              className={styles.textarea}
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              placeholder="Describe the image you want to generate..."
              rows={5}
            />
          </label>

          <label className={styles.field}>
            <span>Style</span>
            <select
              className={styles.select}
              value={style}
              onChange={(event) => setStyle(event.target.value)}
            >
              {STYLE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className={styles.field}>
            <span>Reference image (optional)</span>
            <input
              className={styles.fileInput}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={onReferenceImageChange}
            />
          </label>

          {referenceImageName ? (
            <p className={styles.metaText}>Selected file: {referenceImageName}</p>
          ) : null}

          <div className={styles.buttonRow}>
            <button
              className={styles.primary}
              type="button"
              onClick={onGenerate}
              disabled={generating || (!isSubscribed && freeRemaining <= 0)}
            >
              <FaImage />
              {generating ? "Generating..." : "生成"}
            </button>

            {!isSubscribed && freeRemaining <= 0 ? (
              <button
                className={styles.secondary}
                type="button"
                onClick={onSubscribe}
                disabled={checkoutLoading}
              >
                <FaCrown />
                订阅后继续
              </button>
            ) : null}
          </div>
        </div>

        <div className={styles.resultColumn}>
          {generatedImageUrl ? (
            <div className={styles.resultCard}>
              <Image
                className={styles.generatedImage}
                src={generatedImageUrl}
                alt={`AI generated image in ${style} style`}
                width={1024}
                height={1024}
                unoptimized
                loading="lazy"
              />
              <a
                className={styles.secondary}
                href={generatedImageUrl}
                download={`ai-tool-studio-${style}.png`}
              >
                <FaDownload />
                下载图片
              </a>
            </div>
          ) : (
            <div className={styles.emptyState}>
              <p className={styles.cardText}>
                Your generated image will appear here after the model finishes.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
