import { useEffect, useState } from 'react';
import Header from './header';
import PrefecturesList from './PrefecturesList';
import Graph from './Graph';
import Footer from './Footer';
import styles from '../page.module.css';

const MainContent: React.FC = () => {
  const [selectedPrefectures, setSelectedPrefectures] = useState<number[]>([]);

  const handleSelectedPrefecturesChange = (selectedPrefectures: number[]) => {
    setSelectedPrefectures(selectedPrefectures);
  };

  useEffect(() => {
    // クライアントサイドでのみ実行したい処理
    console.log('This runs only on the client side');
  }, []); // 第2引数を空にすることで初回のみ実行されます

  return (
    <main className={styles.main}>
      <header className='checkbox'>
        <Header title={'超ラスボス課題'} />
      </header>
      <div>
        <PrefecturesList
          onSelectedPrefecturesChange={handleSelectedPrefecturesChange}
        />
        <Graph
          value={'人口データグラフ'}
          selectedPrefectures={selectedPrefectures}
        />
      </div>
      <footer>
        <Footer />
      </footer>
    </main>
  );
};

export default MainContent;
