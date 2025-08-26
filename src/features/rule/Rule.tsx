
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcn/card";
import { Separator } from "@/components/shadcn/separator";
import { useState } from "react";

const teamCultureSections = [
  {
    id: "vacation",
    title: "휴가",
    emoji: "🏖️",
    content: [
      "휴가는 `📅1년에 총 15일` 지급으로 `🕐1시간 단위`로 자유롭게 사용 가능해요",
      "휴가는 분기마다 제공되고 누적이 되지만 해당년도에 모두 소진해야 해요",
      "  * 1분기:4 / 2분기:4 / 3분기:4 / 4분기:3 지급",
      "🏥건강검진 대상자는 반차가 지원돼요",
      "💂‍♂️예비군(민방위) 당연히 유급 휴가예요",
      "경조휴가는 다음과 같이 지급해요",
      "  * 🤵👰결혼 : 5일",
      "  * 🤱출산 : 10일",
      "  * 🙇부친상, 모친상 : 5일",
      "  * 🙇빙부,빙모,시부,시모상 : 3일",
    ],
  },
  {
    id: "dress-code",
    title: "근무복장",
    emoji: "👔",
    content: [
      "👕단정한 옷차림을 기본으로 하고 있어요 (반바지 가능)",
      "  * ❌단추 푼 셔츠, 운동복, 츄리닝 안돼요",
      "  * ✔️외부 미팅이 있는 날은 긴바지가 기본이에요",
      "  * ✔️공장 출입도 마찬가지로 안전상의 이유로 긴바지가 기본이에요",
      "👟운동화를 기본으로 하고 비가 많이 오는 날 한시적으로 샌들까지 가능해요",
      "  * ❌슬리퍼, 크록스 신고 출근 안돼요",
    ],
  },
  {
    id: "education",
    title: "교육",
    emoji: "📚",
    content: [
      "외부에서 진행하는 강의를 듣는 경우 출근으로 인정돼요",
      "  * 최대 연 2회",
      "  * 강의 기간 최대 3일 이내",
      "  * `외부강의` : SK AI Summit, AWS summit 등 외부에서 진행하는 컨퍼런스 등을 의미",
    ],
  },
  {
    id: "birthday",
    title: "생일",
    emoji: "🥳",
    content: [
      "한 달에 한 번 생일자들과 함께 🎉생일 파티를 진행해요",
      "생일 파티 때 SK C&C에서 제공하는 🎂케이크와 함께 팀원들이 구매한 🎁선물을 지급하고 있어요",
      "생일 당일 서울 거주자는 1시간, 그 외 거주자는 1시간 30분 빠른 퇴근이 가능해요",
      "  * 👩🏻‍❤‍👨🏻아내, 👪🏻자녀 생일까지 동일하게 적용돼요",
      "  * ✔️결혼기념일은 25년부터 동일하게 적용돼요",
      "  * ❌부모님, 여자친구는 해당하지 않아요",
      "  * ❌생일이 공휴일이거나 주말인 경우도 해당하지 않아요",
    ],
  },
  {
    id: "overtime",
    title: "OT",
    emoji: "👨‍💻",
    content: [
      "SK C&C와 동등하게 👨‍💻초과 근무에 대한 추가 휴가를 부여하고 있어요",
      "  * 대상은 야간 작업, 주말 작업 등이며 작업 중 대기시간은 포함하지 않아요",
      "    * `대기시간` : 시스템 반영, 시스템 재부팅 등 작업과 관련없는 시간",
      "➕추가 시간은 `🕐1시간 단위`로 부여해요",
      "  * ex) 1시간 50분 -> 1시간 부여, 2시간 10분 -> 2시간 부여",
      "작업 후 각 파트 매니저님 혹은 김태우 매니저님에게 말해주세요",
    ],
  },
];

export default function Rule() {
  const [activeSection, setActiveSection] = useState("vacation");

  const handleTitleClick = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">생산운영 팀문화</h1>
        <p className="text-muted-foreground">
          ⭐️생산운영팀은 팀원분들의 복지를 개선하기 위해 항상 노력하고 있어요⭐️
        </p>
      </div>
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-1/4">
          <div className="sticky top-24">
            <ul className="space-y-2">
              {teamCultureSections.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleTitleClick(section.id);
                    }}
                    className={`text-lg ${
                      activeSection === section.id
                        ? "font-bold text-primary"
                        : "text-muted-foreground"
                    }`}
                  >
                    {section.emoji} {section.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>
        <main className="w-full md:w-3/4">
          <div className="space-y-8">
            {teamCultureSections.map((section, index) => (
              <div key={section.id} id={section.id}>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">
                      {section.emoji} {section.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 list-disc pl-5 text-muted-foreground">
                      {section.content.map((item, itemIndex) => (
                        <li key={itemIndex}>{item.replace(/\*/g, "")}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                {index < teamCultureSections.length - 1 && <Separator className="my-8" />}
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};