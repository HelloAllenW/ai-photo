import Image from "next/image";
import { FaDownload } from "react-icons/fa";
import styles from "@/app/page.module.css";

export default function HistorySection({
  session,
  history,
  formatDateTime,
}) {
  return (
    <section className={styles.generatorCard}>
      <div className={styles.panelHeader}>
        <div>
          <p className={styles.cardLabel}>生成历史</p>
          <h2>Recent generated images</h2>
        </div>
        <div className={styles.usageBadge}>{history.length} 条记录</div>
      </div>

      {session?.user ? (
        history.length ? (
          <div className={styles.historyList}>
            {history.map((item) => (
              <article className={styles.historyItem} key={item.id}>
                <div className={styles.historyPreview}>
                  <Image
                    className={styles.historyImage}
                    src={item.image_url}
                    alt={`AI generated image in ${item.style} style`}
                    width={360}
                    height={360}
                    unoptimized
                    loading="lazy"
                  />
                </div>
                <div className={styles.historyMeta}>
                  <p className={styles.historyStyle}>{item.style}</p>
                  <p className={styles.metaText}>{formatDateTime(item.created_at)}</p>
                  <a
                    className={styles.secondary}
                    href={item.image_url}
                    download={`ai-tool-studio-${item.style}-${item.id}.png`}
                  >
                    <FaDownload />
                    下载图片
                  </a>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <p className={styles.cardText}>
              No generated images yet. Create your first image to build your
              history.
            </p>
          </div>
        )
      ) : (
        <div className={styles.emptyState}>
          <p className={styles.cardText}>
            Sign in to view and download your generated image history.
          </p>
        </div>
      )}
    </section>
  );
}
