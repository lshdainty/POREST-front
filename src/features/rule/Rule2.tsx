import React from 'react';

const Rule2: React.FC = () => {
  return (
    <div className="container mx-auto py-12 px-4 md:px-0 max-w-4xl">
      {/* Main Title Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-card-foreground leading-tight mb-4">
          생산운영 팀문화
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-card-foreground">
          생산운영팀은 팀원분들의 복지를 개선하기 위해 항상 노력하고 있어요
        </p>
      </div>

      {/* Section with Cards - Vacation */}
      <div className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-card-foreground mb-6">
          🏖️ 휴가
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-card rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-lg">
            <img src="/web/rule_1_1.png" alt="Vacation" className="w-full h-48 object-cover" />
            <div className="p-5">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-card-foreground mb-2">휴가 일수</h3>
              <p className="text-sm text-gray-600 dark:text-card-foreground line-clamp-4">
                휴가는 📅1년에 총 15일 지급으로 🕐1시간 단위로 자유롭게 사용 가능해요.
              </p>
            </div>
          </div>
          <div className="bg-card rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-lg">
            <img src="/web/rule_1_2.png" alt="Day Off" className="w-full h-48 object-cover" />
            <div className="p-5">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-card-foreground mb-2">지급 시기</h3>
              <p className="text-sm text-gray-600 dark:text-card-foreground line-clamp-4">
                휴가는 분기마다 제공되고 누적이 되지만 해당년도에 모두 소진해야 해요.<br/>
                4, 4, 4, 3씩 제공돼요.
              </p>
            </div>
          </div>
          <div className="bg-card rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-lg">
            <img src="/web/rule_1_3.png" alt="Family Event" className="w-full h-48 object-cover" />
            <div className="p-5">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-card-foreground mb-2">경조 휴가</h3>
              <p className="text-sm text-gray-600 dark:text-card-foreground line-clamp-4">
                🤵👰결혼: 5일<br/>
                🤱출산: 10일<br/>
                🙇부/모친상: 5일<br/>
                🙇빙부/모,시부/모상: 3일<br/>
              </p>
            </div>
          </div>
          <div className="bg-card rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-lg">
            <img src="/web/rule_1_4.png" alt="Health Check" className="w-full h-48 object-cover" />
            <div className="p-5">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-card-foreground mb-2">기타 휴가</h3>
              <p className="text-sm text-gray-600 dark:text-card-foreground line-clamp-4">
                🏥건강검진 대상자는 반차가 지원돼요.<br/>
                💂‍♂️예비군(민방위) 당연히 유급 휴가예요.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section with Cards - Dress Code */}
      <div className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-card-foreground mb-6">
          👔 복장
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-card rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-lg">
            <img src="/web/rule_2_1.png" alt="Business Casual" className="w-full h-48 object-cover" />
            <div className="p-5">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-card-foreground mb-2">기본 복장</h3>
              <p className="text-sm text-gray-600 dark:text-card-foreground line-clamp-4">
                👕단정한 옷차림을 지향해요. 더운 날엔 반바지입고 편안하게 출근하세요.
              </p>
            </div>
          </div>
          <div className="bg-card rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-lg">
            <img src="/web/rule_2_2.png" alt="Formal Dress" className="w-full h-48 object-cover" />
            <div className="p-5">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-card-foreground mb-2">외부 미팅</h3>
              <p className="text-sm text-gray-600 dark:text-card-foreground line-clamp-4">
                👔고객과의 미팅이나 공식 행사 시에는 긴바지와 깔끔한 옷차림을 착용하여 전문성을 보여줘요.
              </p>
            </div>
          </div>
          <div className="bg-card rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-lg">
            <img src="/web/rule_2_3.png" alt="T-shirt" className="w-full h-48 object-cover" />
            <div className="p-5">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-card-foreground mb-2">현장 출장</h3>
              <p className="text-sm text-gray-600 dark:text-card-foreground line-clamp-4">
                🏭생산 현장은 안전제일!<br/>
                긴바지와 운동화가 필수예요.
              </p>
            </div>
          </div>
          <div className="bg-card rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-lg">
            <img src="/web/rule_2_4.png" alt="Sandals" className="w-full h-48 object-cover" />
            <div className="p-5">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-card-foreground mb-2">지양 복장</h3>
              <p className="text-sm text-gray-600 dark:text-card-foreground line-clamp-4">
                👔셔츠는 단추 잠구기<br/>
                🙅‍♂️운동복, 츄리닝 안돼요!<br/>
                🩴슬리퍼, 크록스 안돼요!<br/>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section with Cards - Dress Code */}
      <div className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-card-foreground mb-6">
          👔 교육
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-card rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-lg">
            <img src="https://source.unsplash.com/random/300x200?formal-dress" alt="Business Casual" className="w-full h-48 object-cover" />
            <div className="p-5">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-card-foreground mb-2"></h3>
              <p className="text-sm text-gray-600 dark:text-card-foreground line-clamp-4">
                
              </p>
            </div>
          </div>
          <div className="bg-card rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-lg">
            <img src="https://source.unsplash.com/random/300x200?formal-dress" alt="Formal Dress" className="w-full h-48 object-cover" />
            <div className="p-5">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-card-foreground mb-2"></h3>
              <p className="text-sm text-gray-600 dark:text-card-foreground line-clamp-4">
                
              </p>
            </div>
          </div>
          <div className="bg-card rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-lg">
            <img src="https://source.unsplash.com/random/300x200?t-shirt" alt="T-shirt" className="w-full h-48 object-cover" />
            <div className="p-5">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-card-foreground mb-2"></h3>
              <p className="text-sm text-gray-600 dark:text-card-foreground line-clamp-4">
                
              </p>
            </div>
          </div>
          <div className="bg-card rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-lg">
            <img src="https://source.unsplash.com/random/300x200?sandals" alt="Sandals" className="w-full h-48 object-cover" />
            <div className="p-5">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-card-foreground mb-2"></h3>
              <p className="text-sm text-gray-600 dark:text-card-foreground line-clamp-4">
                
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rule2;