import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'vi';

export const translations = {
  en: {
    nav: {
      services: "Services",
      why: "Why Labs",
      cases: "Case Studies",
      contact: "Hire Us",
      cta: "Scope Project"
    },
    hero: {
      indicator: "4 Active Builds This Week",
      title: "We build digital<br/><span class=\"text-gradient\">products.</span> <span class=\"text-text-muted\">Not just code.</span>",
      desc: "A software development lab engineering high-leverage products: Webapps, AI tools, marketing automations, and white-hat SEO tooling. Built with speed, scoped with data.",
      cta_estim: "Start Project Scoping",
      cta_demo: "Explore Our Demos",
      trust: "Trusted by 40+ founders & product teams"
    },
    trustbar: {
      label: "Powering products for fast-moving teams"
    },
    testimonials: {
      tag: "Client Voices",
      title: "Teams that shipped with us.",
      desc: "We measure success in production deploys and revenue, not slide decks.",
      q1: "Helitiva shipped our billing SaaS in 4 weeks. The code was clean, documented, and ours from day one.",
      n1: "Alex Rivers",
      r1: "Founder, FlowSaaS",
      q2: "Their AI agent cut our support response time by 80%. It just worked, no babysitting required.",
      n2: "Marcus Vo",
      r2: "CTO, DocuAgent",
      q3: "Their SEO toolkit lifted our organic traffic 3× in one quarter — all white-hat, zero penalties.",
      n3: "Linh Pham",
      r3: "Growth Lead, RankPulse"
    },
    stats: {
      shipped: "Products Shipped",
      ai: "AI Agents Built",
      automations: "Automations Active",
      traffic: "SEO Traffic Driven",
      growth: "100% Growth",
      deployed: "Deployed",
      uptime: "Jobs / Daily",
      daily: "340% Growth"
    },
    services: {
      subtitle: "Our Capabilities",
      title: "What we build — and how well we build it.",
      desc: "Four specialized engineering tracks, each with a proven delivery record. From AI-powered products to programmatic growth engines."
    },
    webapp: {
      role: "Webapp Specialist",
      title: "Webapps & SaaS Systems",
      desc: "High-performance applications built with Next.js, Node, and secure databases.",
      widget_title: "Billing Engine Simulator",
      widget_status: "Active",
      slider_label: "Monthly Active Users (MAU)",
      cost_label: "Monthly Cost"
    },
    ai: {
      role: "AI Specialist",
      title: "AI Agents & RAG Systems",
      desc: "Intelligent agents automating customer support, analysis, and data tasks.",
      widget_title: "AI Support Chatbot",
      widget_status: "Active",
      thinking: "Thinking...",
      default: "Ask me about 'api handler' or 'marketing email' to see mock outputs.",
      hook: "AI Response for marketing email: Custom draft generated!\n\n\"Subject: Unlock 3x efficiency with AI Sprints\nHi {{name}},\nWe designed a RAG agent targeting support tickets...\"",
      api: "AI Response for api handler: Code template generated!\n\n```javascript\nexport async function handler(req) {\n  const data = await req.json();\n  return Response.json({ status: 'ok' });\n}\n```",
      price: "AI Response for price: Our flat-rate sprints start at $8,500 for prototypes and $18,500 for fully-featured MVPs."
    },
    marketing: {
      role: "Automation Specialist",
      title: "Marketing & Workflow Automation",
      desc: "Integrations connecting CRM, email, social media, and internal ops.",
      widget_title: "LinkedIn/X Scheduler",
      widget_status: "Active",
      sched_btn: "Schedule Post",
      sched_status: "Scheduled!",
      post_placeholder: "Enter social post content here..."
    },
    seo: {
      role: "SEO Specialist",
      title: "Programmatic SEO & Scaling",
      desc: "Systems generating thousands of high-quality pages to capture search intent.",
      widget_title: "SEO Projected Organic Traffic",
      widget_status: "Active",
      slider_label: "SEO Optimization Level",
      projected_label: "Monthly Organic Visits"
    },
    steps: {
      tag: "Development Pipeline",
      title: "Four steps. Full transparency.",
      desc: "From blueprinting to launching — how we deliver products with structural speed.",
      step1: "Scope & Architect",
      step1_desc: "We map system schemas, sequence flowcharts, and technical API constraints.",
      step2: "Build Prototype",
      step2_desc: "Our engineers ship a functioning v1.0 within 14 days, connecting all critical databases.",
      step3: "Code Audit",
      step3_desc: "Automatic security scans and testing models run to clean vulnerabilities.",
      step4: "Deploy & Transfer",
      step4_desc: "We publish to production and sign over 100% IP ownership and git repositories."
    },
    pricing: {
      tag: "Sprints pricing",
      title: "Flat-rate sprints. No estimates padding.",
      desc: "Simple, predictable plans. We deliver increments of code weekly.",
      plan1_title: "Prototype Sprint",
      plan1_desc: "Perfect for testing ideas, raising capital, or building small micro-automations.",
      plan1_price: "$8,500",
      plan1_time: "1-2 Weeks",
      plan1_item1: "Functional Prototype v1.0",
      plan1_item2: "Standard DB & API setup",
      plan1_item3: "100% Source code transfer",
      plan2_title: "MVP Sprint",
      plan2_desc: "Best for custom SaaS platforms, fully loaded AI agents, or automated database products.",
      plan2_price: "$18,500",
      plan2_time: "3-4 Weeks",
      plan2_item1: "Production-ready Web App",
      plan2_item2: "Multi-model LLM / Agent flow",
      plan2_item3: "Full payment integration",
      plan2_item4: "Secure User Auth & Dashboards",
      plan3_title: "Scale Sprint",
      plan3_desc: "Designed for enterprise automation, SEO tooling platforms, or complex data integrations.",
      plan3_price: "$32,000+",
      plan3_time: "5+ Weeks",
      plan3_item1: "Multi-tenant architecture",
      plan3_item2: "Advanced SEO audit & reporting suite",
      plan3_item3: "Large-scale data pipelines & integrations",
      plan3_item4: "Custom serverless infrastructure",
      cta: "Select this tier"
    },
    cases: {
      tag: "Case Studies",
      title: "Featured builds.",
      desc: "Real products shipped to production with measurable business metrics.",
      card1_tag: "Webapp + SaaS",
      card1_time: "Shipped in 4 weeks",
      card1_title: "FlowSaaS Billing",
      card1_desc: "A multi-tenant SaaS subscription manager with dynamic seat billing, webhook synchronization, and tax calculations.",
      card2_tag: "AI Agent",
      card2_time: "Shipped in 2 weeks",
      card2_title: "DocuAgent RAG",
      card2_desc: "A smart document analysis model that processes PDFs, builds vector search libraries, and answers complex queries with source citations.",
      card3_tag: "SEO Tooling",
      card3_time: "Shipped in 3 weeks",
      card3_title: "RankPulse Engine",
      card3_desc: "A programmatic SEO generation engine that scans keywords, publishes optimized pages, and tracks rankings dynamically."
    },
    faq: {
      tag: "FAQ",
      title: "Got questions? We have code.",
      desc: "Everything you need to know about working with Helitiva Labs.",
      q1: "What exactly is a \"software development lab\"?",
      a1: "We are an elite engineering team that acts as a plug-and-play tech department. We skip useless meetings, overhead, and fluff to focus entirely on writing production-ready code.",
      q2: "How fast can we launch a working prototype?",
      a2: "Our sprint model ensures a functional, deployable v1.0 prototype within 10 to 14 days of kicking off development. We prioritize engineering core pathways first, leaving secondary aesthetics for active user testing.",
      q3: "How do we coordinate sprints and communicate?",
      a3: "We work asynchronously via a dedicated Slack channel and hold brief milestone demonstrations. We skip useless daily meetings to maximize writing code, sending weekly video walkthroughs instead.",
      q4: "Can we modify project requirements midway?",
      a4: "Yes! Since we operate on weekly sprint structures, you can reprioritize the upcoming sprint backlog. We adjust tasks instantly without charging change order penalty fees.",
      q5: "Do you offer post-launch system maintenance?",
      a5: "Yes. Every shipped MVP includes 30 days of free bug-squashing and technical support. Afterwards, you can book ad-hoc maintenance sprints or hire us to transition the code to your in-house engineers.",
      q6: "What tech stack do you recommend?",
      a6: "We build using Next.js/Tailwind for SaaS interfaces, Node.js or FastAPI (Python) for processing pipelines, PostgreSQL/Redis for databases, and LangChain/LlamaIndex for LLM agent configurations."
    },
    form: {
      tag: "Start Building",
      title: "Scope your project.",
      desc: "Get an engineering estimate and timeline in under 12 hours.",
      step: "Step {num} of 3",
      step1_title: "Select the services your project requires:",
      step1_err: "Please select at least one service to proceed.",
      step1_opt1: "Webapps & SaaS Systems",
      step1_opt2: "AI Agents & Integration",
      step1_opt3: "Marketing Automation",
      step1_opt4: "Programmatic SEO Platforms",
      step2_title: "Select your estimated sprint budget:",
      step2_opt1_title: "Prototype Sprint ($8,500)",
      step2_opt1_desc: "Basic UI & Core relational DB",
      step2_opt2_title: "MVP Sprint ($18,500)",
      step2_opt2_desc: "Full SaaS product, Payment & Auth",
      step2_opt3_title: "Scale Sprint ($32,000+)",
      step2_opt3_desc: "Large-scale enterprise system",
      step3_title: "Tell us about your project:",
      step3_placeholder: "Describe what you want to build (e.g., An AI-driven SaaS app for rank tracking)...",
      btn_back: "Back",
      btn_next: "Next Step",
      btn_submit: "Submit Scoping Scenarios",
      name_label: "Your Name",
      email_label: "Email Address",
      success_title: "Estimate Request Sent!",
      success_desc: "Our engineering team will analyze your requirements and email you a detailed sprint roadmap in under 12 hours."
    },
    footer: {
      tagline: "High-leverage software development.",
      services_header: "Capabilities",
      pipeline_header: "Company",
      copyright: "© 2026 Helitiva Labs · All rights reserved · 100% IP ownership guaranteed",
      privacy: "Privacy",
      terms: "Terms",
      sitemap: "Sitemap"
    }
  },
  vi: {
    nav: {
      services: "Dịch vụ",
      why: "Tại sao chọn Labs",
      cases: "Case Studies",
      contact: "Hợp tác",
      cta: "Nhận báo giá"
    },
    hero: {
      indicator: "4 Dự án đang triển khai tuần này",
      title: "Chúng tôi xây dựng<br/><span class=\"text-gradient\">sản phẩm.</span> <span class=\"text-text-muted\">Không chỉ là code.</span>",
      desc: "Một lab phát triển phần mềm thiết kế các sản phẩm hiệu suất cao: Webapp, Công cụ AI, Tự động hóa Marketing và Công cụ SEO. Xây dựng nhanh chóng, định hình bằng dữ liệu.",
      cta_estim: "Bắt đầu ước tính dự án",
      cta_demo: "Xem bản thử nghiệm",
      trust: "Được tin cậy bởi 40+ nhà sáng lập & đội ngũ sản phẩm"
    },
    trustbar: {
      label: "Vận hành sản phẩm cho các đội ngũ phát triển nhanh"
    },
    testimonials: {
      tag: "Ý kiến khách hàng",
      title: "Những đội ngũ đã đồng hành cùng chúng tôi.",
      desc: "Chúng tôi đo lường thành công bằng số lần deploy thực tế và doanh thu, không phải slide thuyết trình.",
      q1: "Helitiva đã bàn giao sản phẩm SaaS thanh toán của chúng tôi trong 4 tuần. Code sạch, tài liệu đầy đủ và là của chúng tôi ngay từ ngày đầu.",
      n1: "Alex Rivers",
      r1: "Founder, FlowSaaS",
      q2: "Agent AI của họ đã giảm 80% thời gian phản hồi hỗ trợ của chúng tôi. Nó tự vận hành trơn tru mà không cần can thiệp thủ công.",
      n2: "Marcus Vo",
      r2: "CTO, DocuAgent",
      q3: "Bộ công cụ SEO của họ đã tăng lượng truy cập tự nhiên gấp 3 lần trong một quý — hoàn toàn an toàn và không bị phạt.",
      n3: "Linh Pham",
      r3: "Trưởng nhóm tăng trưởng, RankPulse"
    },
    stats: {
      shipped: "Sản phẩm đã bàn giao",
      ai: "Agent AI đã xây dựng",
      automations: "Hệ thống tự động hoạt động",
      traffic: "Lượt truy cập SEO mang lại",
      growth: "Tăng trưởng 100%",
      deployed: "Đã Deploy",
      uptime: "Tác vụ hàng ngày",
      daily: "Tăng trưởng 340%"
    },
    services: {
      subtitle: "Năng lực cốt lõi",
      title: "Chúng tôi xây gì — và xây tốt đến đâu.",
      desc: "Bốn hướng phát triển chuyên biệt, mỗi hướng đều có track record bàn giao thực tế. Từ sản phẩm AI đến hệ thống tăng trưởng tự động hóa."
    },
    webapp: {
      role: "Chuyên gia Webapp",
      title: "Hệ thống Webapp & SaaS",
      desc: "Ứng dụng hiệu năng cao được xây dựng bằng Next.js, Node và cơ sở dữ liệu bảo mật.",
      widget_title: "Trình mô phỏng thanh toán",
      widget_status: "Hoạt động",
      slider_label: "Số người dùng hoạt động (MAU)",
      cost_label: "Chi phí hàng tháng"
    },
    ai: {
      role: "Chuyên gia AI",
      title: "Agent AI & Hệ thống RAG",
      desc: "Các agent thông minh tự động hóa hỗ trợ khách hàng, phân tích và xử lý dữ liệu.",
      widget_title: "Chatbot hỗ trợ AI",
      widget_status: "Hoạt động",
      thinking: "Đang suy nghĩ...",
      default: "Hỏi tôi về 'api handler' hoặc 'marketing email' để chạy bản mẫu.",
      hook: "AI Trả lời cho marketing email: Đã tạo bản nháp mẫu!\n\n\"Tiêu đề: Tối ưu 3 lần hiệu suất với AI Sprints\nChào bạn,\nChúng tôi đã thiết kế một agent RAG nhắm mục tiêu vé hỗ trợ...\"",
      api: "AI Trả lời cho api handler: Đã tạo mẫu code API!\n\n```javascript\nexport async function handler(req) {\n  const data = await req.json();\n  return Response.json({ status: 'ok' });\n}\n```",
      price: "AI Trả lời cho giá: Sprints trọn gói bắt đầu từ $8.500 cho bản nguyên mẫu và $18.500 cho MVP đầy đủ tính năng."
    },
    marketing: {
      role: "Chuyên gia Tự động hóa",
      title: "Tự động hóa Quy trình & Marketing",
      desc: "Kết nối đồng bộ CRM, email, mạng xã hội và vận hành nội bộ.",
      widget_title: "Trình lập lịch bài viết LinkedIn/X",
      widget_status: "Hoạt động",
      sched_btn: "Lên lịch bài viết",
      sched_status: "Đã lên lịch!",
      post_placeholder: "Nhập nội dung bài viết mạng xã hội tại đây..."
    },
    seo: {
      role: "Chuyên gia SEO",
      title: "SEO Tự động & Nhân rộng",
      desc: "Hệ thống tạo hàng ngàn trang chất lượng cao để tiếp cận người dùng tìm kiếm.",
      widget_title: "Lưu lượng truy cập SEO dự kiến",
      widget_status: "Hoạt động",
      slider_label: "Mức độ tối ưu SEO",
      projected_label: "Lượt truy cập tự nhiên/tháng"
    },
    steps: {
      tag: "Quy trình phát triển",
      title: "4 bước rõ ràng. Minh bạch tối đa.",
      desc: "Từ bản vẽ thiết kế đến khi ra mắt — cách chúng tôi bàn giao sản phẩm với tốc độ tối ưu.",
      step1: "Xác định & Thiết kế",
      step1_desc: "Chúng tôi vẽ sơ đồ hệ thống, quy trình hoạt động và các giới hạn API.",
      step2: "Xây dựng Nguyên mẫu",
      step2_desc: "Đội ngũ kỹ sư sẽ chạy bản v1.0 thực tế trong 14 ngày, kết nối các database quan trọng.",
      step3: "Kiểm tra & Audit",
      step3_desc: "Chạy các trình quét bảo mật tự động và kiểm thử để loại bỏ lỗ hổng.",
      step4: "Deploy & Bàn giao",
      step4_desc: "Chúng tôi deploy lên production, chuyển giao 100% sở hữu trí tuệ và git repo."
    },
    pricing: {
      tag: "Bảng giá Sprints",
      title: "Giá trọn gói theo Sprint. Không phát sinh chi phí.",
      desc: "Kế hoạch đơn giản, dễ dự đoán. Chúng tôi bàn giao phần tăng trưởng code hàng tuần.",
      plan1_title: "Sprint Nguyên Mẫu",
      plan1_desc: "Hoàn hảo để thử nghiệm ý tưởng, gọi vốn hoặc xây dựng tự động hóa nhỏ.",
      plan1_price: "$8,500",
      plan1_time: "1-2 Tuần",
      plan1_item1: "Nguyên mẫu hoạt động v1.0",
      plan1_item2: "Cài đặt Database & API cơ bản",
      plan1_item3: "Chuyển giao 100% source code",
      plan2_title: "Sprint MVP",
      plan2_desc: "Tốt nhất cho các nền tảng SaaS tùy chỉnh, AI Agent đầy đủ hoặc cơ sở dữ liệu tự động.",
      plan2_price: "$18,500",
      plan2_time: "3-4 Tuần",
      plan2_item1: "Ứng dụng web sẵn sàng chạy thực tế",
      plan2_item2: "Luồng Agent AI đa mô hình",
      plan2_item3: "Tích hợp thanh toán đầy đủ",
      plan2_item4: "Hệ thống Auth bảo mật & Dashboard",
      plan3_title: "Sprint Quy Mô",
      plan3_desc: "Thiết kế cho tự động hóa doanh nghiệp, nền tảng SEO hoặc tích hợp dữ liệu phức tạp.",
      plan3_price: "$32,000+",
      plan3_time: "5+ Tuần",
      plan3_item1: "Kiến trúc đa khách thuê - Multi-tenant",
      plan3_item2: "Bộ công cụ kiểm tra & báo cáo SEO nâng cao",
      plan3_item3: "Đường ống dữ liệu & tích hợp quy mô lớn",
      plan3_item4: "Hạ tầng serverless riêng",
      cta: "Chọn gói này"
    },
    cases: {
      tag: "Case Studies",
      title: "Những sản phẩm đã phát triển.",
      desc: "Các sản phẩm thực tế hoạt động trên môi trường sản xuất với chỉ số rõ ràng.",
      card1_tag: "Webapp + SaaS",
      card1_time: "Bàn giao trong 4 tuần",
      card1_title: "FlowSaaS Billing",
      card1_desc: "Trình quản lý đăng ký SaaS đa khách thuê với tính năng tính phí seat động, đồng bộ webhook và tính thuế.",
      card2_tag: "AI Agent",
      card2_time: "Bàn giao trong 2 tuần",
      card2_title: "DocuAgent RAG",
      card2_desc: "Trình phân tích tài liệu thông minh xử lý PDF, tạo thư viện tìm kiếm vector và trả lời các câu hỏi phức tạp kèm trích dẫn nguồn.",
      card3_tag: "Công cụ SEO",
      card3_time: "Bàn giao trong 3 tuần",
      card3_title: "RankPulse Engine",
      card3_desc: "Trình tạo trang SEO tự động quét từ khóa, xuất bản các trang tối ưu hóa và theo dõi thứ hạng trực quan."
    },
    faq: {
      tag: "FAQ",
      title: "Bạn có câu hỏi? Chúng tôi có giải pháp.",
      desc: "Tất cả những gì bạn cần biết khi làm việc cùng Helitiva Labs.",
      q1: "\"Software development lab\" chính xác là gì?",
      a1: "Chúng tôi là đội ngũ kỹ sư tinh gọn hoạt động như một phòng kỹ thuật thuê ngoài. Chúng tôi bỏ qua các cuộc họp vô bổ, tối ưu chi phí để tập trung hoàn toàn vào việc viết code chất lượng cao.",
      q2: "Nguyên mẫu hoạt động có thể ra mắt nhanh thế nào?",
      a2: "Quy trình sprint đảm bảo nguyên mẫu hoạt động v1.0 trong 10-14 ngày. Chúng tôi ưu tiên luồng xử lý cốt lõi trước, giao diện phụ sẽ hoàn thiện sau dựa trên phản hồi người dùng.",
      q3: "Chúng ta sẽ trao đổi và điều phối tiến độ thế nào?",
      a3: "Chúng ta sẽ trao đổi bất đồng bộ qua Slack và demo các mốc chính. Chúng tôi hạn chế các cuộc họp daily vô ích để tập trung viết code, thay vào đó sẽ gửi video báo cáo mỗi tuần.",
      q4: "Tôi có thể sửa yêu cầu khi dự án đang chạy không?",
      a4: "Được chứ! Vì chúng tôi chạy theo sprint tuần, bạn có thể cấu trúc lại thứ tự ưu tiên cho sprint tiếp theo. Chúng tôi sẽ điều chỉnh nhiệm vụ mà không tính phí phạt thay đổi.",
      q5: "Lab có hỗ trợ bảo trì sau khi bàn giao sản phẩm không?",
      a5: "Có. Mọi MVP bàn giao đều gồm 30 ngày sửa lỗi và hỗ trợ kỹ thuật miễn phí. Sau đó, bạn có thể mua sprint bảo trì hoặc chúng tôi sẽ bàn giao hoàn toàn cho kỹ sư nội bộ của bạn.",
      q6: "Những công nghệ nào được khuyên dùng?",
      a6: "Chúng tôi xây dựng bằng Next.js/Tailwind cho giao diện SaaS, Node.js hoặc FastAPI (Python) cho xử lý, PostgreSQL/Redis cho cơ sở dữ liệu và LangChain cho Agentic AI."
    },
    form: {
      tag: "Bắt đầu xây dựng",
      title: "Thiết lập quy mô dự án.",
      desc: "Nhận ước tính kỹ thuật và tiến độ trong vòng 12 giờ.",
      step: "Bước {num} / 3",
      step1_title: "Chọn các dịch vụ dự án cần:",
      step1_err: "Vui lòng chọn ít nhất một dịch vụ để tiếp tục.",
      step1_opt1: "Hệ thống Webapp & SaaS",
      step1_opt2: "Agent AI & Tích hợp AI",
      step1_opt3: "Tự động hóa Marketing",
      step1_opt4: "Nền tảng SEO tự động",
      step2_title: "Chọn ngân sách dự kiến của bạn:",
      step2_opt1_title: "Sprint Nguyên Mẫu ($8,500)",
      step2_opt1_desc: "Giao diện cơ bản & Database cốt lõi",
      step2_opt2_title: "Sprint MVP ($18,500)",
      step2_opt2_desc: "Sản phẩm SaaS đầy đủ, Auth & Thanh toán",
      step2_opt3_title: "Sprint Quy Mô ($32,000+)",
      step2_opt3_desc: "Hệ thống mở rộng quy mô lớn",
      step3_title: "Chia sẻ về dự án của bạn:",
      step3_placeholder: "Mô tả những gì bạn muốn xây dựng (ví dụ: Một ứng dụng SaaS hỗ trợ theo dõi thứ hạng bằng AI)...",
      btn_back: "Quay lại",
      btn_next: "Tiếp theo",
      btn_submit: "Gửi thông tin dự án",
      name_label: "Tên của bạn",
      email_label: "Địa chỉ Email",
      success_title: "Đã gửi yêu cầu!",
      success_desc: "Đội ngũ kỹ sư sẽ phân tích yêu cầu và gửi lộ trình chi tiết qua email cho bạn trong vòng 12 giờ."
    },
    footer: {
      tagline: "Phát triển phần mềm hiệu suất cao.",
      services_header: "Năng lực",
      pipeline_header: "Công ty",
      copyright: "© 2026 Helitiva Labs · Mọi quyền được bảo lưu · Đảm bảo sở hữu trí tuệ 100%",
      privacy: "Bảo mật",
      terms: "Điều khoản",
      sitemap: "Sơ đồ trang"
    }
  }
};

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.en;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('lang');
    return (saved === 'en' || saved === 'vi') ? saved : 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('lang', lang);
  };

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
