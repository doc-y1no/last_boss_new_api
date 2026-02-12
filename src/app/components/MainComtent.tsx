import { useState } from 'react';
import Header from './header';
import PrefecturesList, { type Prefecture } from './PrefecturesList';
import Graph from './Graph';
import Footer from './Footer';
import styles from '../page.module.css';

const MainContent: React.FC = () => {
  const [selectedPrefectures, setSelectedPrefectures] = useState<number[]>([]);
  const [prefectures, setPrefectures] = useState<Prefecture[]>([]);

  const handleSelectedPrefecturesChange = (selectedPrefectures: number[]) => {
    setSelectedPrefectures(selectedPrefectures);
  };

  return (
    <main className={styles.main}>
      <header className='checkbox'>
        <Header title={'超ラスボス課題'} />
      </header>
      <div>
        <PrefecturesList
          onSelectedPrefecturesChange={handleSelectedPrefecturesChange}
          onPrefecturesLoaded={setPrefectures}
        />
        <Graph
          value={'人口データグラフ'}
          selectedPrefectures={selectedPrefectures}
          prefectures={prefectures}
        />
      </div>
      <footer>
        <Footer />
      </footer>
    </main>
  );
};

export default MainContent;
