import React from 'react';

const Rule2: React.FC = () => {
  return (
    <div className="container mx-auto py-12 px-4 md:px-0 max-w-4xl">
      {/* Main Title Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
          팀 문화
        </h1>
        <p className="text-lg md:text-xl text-gray-600">
          노후 대비와 경제적 자유를 위해 꼭 알아둬야 할 정보들
        </p>
      </div>

      {/* Section with Cards - Example 1 */}
      <div className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
          연금저축펀드
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-lg">
            <img src="https://via.placeholder.com/300x200" alt="Card Image" className="w-full h-40 object-cover" />
            <div className="p-5">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">연금저축펀드란?</h3>
              <p className="text-sm text-gray-600 line-clamp-3">
                연금저축펀드는 노후 대비를 위한 대표적인 절세 상품입니다. 연말정산 시 세액공제 혜택을 받을 수 있으며, 장기적인 관점에서 안정적인 수익을 추구할 수 있습니다.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-lg">
            <img src="https://via.placeholder.com/300x200" alt="Card Image" className="w-full h-40 object-cover" />
            <div className="p-5">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">가입 방법 및 유의사항</h3>
              <p className="text-sm text-gray-600 line-clamp-3">
                증권사, 은행 등 다양한 금융기관에서 가입할 수 있으며, 상품별 수수료와 운용 전략을 꼼꼼히 비교해야 합니다. 중도 해지 시 불이익이 있을 수 있으니 신중하게 결정하세요.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-lg">
            <img src="https://via.placeholder.com/300x200" alt="Card Image" className="w-full h-40 object-cover" />
            <div className="p-5">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">세액공제 혜택 자세히 보기</h3>
              <p className="text-sm text-gray-600 line-clamp-3">
                연간 납입액의 일정 비율을 세액공제 받을 수 있습니다. 총 급여액에 따라 공제 한도가 달라지므로, 본인의 소득 수준에 맞는 납입 계획을 세우는 것이 중요합니다.
              </p>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-lg">
            <img src="https://via.placeholder.com/300x200" alt="Card Image" className="w-full h-40 object-cover" />
            <div className="p-5">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">투자 전략 및 포트폴리오</h3>
              <p className="text-sm text-gray-600 line-clamp-3">
                다양한 펀드 상품 중 본인의 투자 성향과 목표 수익률에 맞는 상품을 선택하고, 주기적인 리밸런싱을 통해 포트폴리오를 관리하는 것이 중요합니다.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* You can add more sections here following the same pattern */}

    </div>
  );
};

export default Rule2;