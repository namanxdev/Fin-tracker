import React, { useEffect, useState } from 'react';
import useThemeStore from '../../store/themeStore';
import useDashboardStore from '../../store/dashboardStore';

function DashboardTips() {
  // Fix 1: Use shallow selector to prevent infinite rerenders
  const isDark = useThemeStore(state => state.isDark());
  const [tips, setTips] = useState([]);
  
  // Fix 2: Use proper selectors with shallow equality
  const summaryData = useDashboardStore(state => state.summaryData);
  const budgetPerformance = useDashboardStore(state => state.budgetPerformance);
  const savingsData = useDashboardStore(state => state.savingsData);

  // This function generates a prompt based on financial data
  const generateFinancialTipsPrompt = (financialData) => {
    const {
      summaryData,
      budgetPerformance,
      topExpenseCategories,
      savingsRate,
      monthlyIncome,
      monthlyExpenses
    } = financialData;

    // Start with a base prompt
    let prompt = `You are a financial advisor assistant. Based on the following financial data, provide three specific, actionable tips to help improve the user's financial situation. Format each tip with a title and a brief explanation. Keep each tip concise (2-3 sentences max).

Financial Summary:
- Monthly Income: $${monthlyIncome}
- Monthly Expenses: $${monthlyExpenses}
- Savings Rate: ${savingsRate}%
`;

    // Add budget information if available
    if (budgetPerformance && budgetPerformance.length > 0) {
      prompt += "\nBudget Status:\n";
      budgetPerformance.forEach(budget => {
        prompt += `- ${budget.category}: ${budget.percentUsed}% used (${budget.status})\n`;
      });
    }

    // Add top spending categories if available
    if (topExpenseCategories && topExpenseCategories.length > 0) {
      prompt += "\nTop Spending Categories:\n";
    //   console.log("Top Expense Categories:", topExpenseCategories);
      topExpenseCategories.forEach(category => {
        prompt += `- ${category._id}: $${category.total}\n`;
      });
    }

    // Add specific instructions for the AI
    prompt += `
Please provide tips that address:
1. A specific way to reduce expenses in one of the top categories
2. How to improve budget management for any categories that are close to or over budget
3. A recommendation to increase savings rate if it's below 20%, or an investment tip if above 20%

Format the response as three tips with clear titles and brief explanations. Don't include any introduction or conclusion.`;

    return prompt;
  };

  // Mock response generation (in a real app, this would call an AI API)
  const generateMockTips = (financialData) => {
    const tips = [];

    // Generate tip about highest expense category
    if (financialData.topExpenseCategories && financialData.topExpenseCategories.length > 0) {
      const topCategory = financialData.topExpenseCategories[0];
      tips.push({
        title: `Reduce ${topCategory._id} Expenses`,
        content: `You spent $${topCategory.total} on ${topCategory._id} this month. Consider setting a weekly limit and tracking these expenses more closely to reduce this amount by 15%.`
      });
    } else {
      tips.push({
        title: "Track Your Expenses",
        content: "Start categorizing all your expenses to identify areas where you can cut back. Aim to record every transaction for at least one month."
      });
    }

    // Generate tip about budget management
    if (financialData.budgetPerformance && financialData.budgetPerformance.length > 0) {
      const overBudget = financialData.budgetPerformance.find(b => b.percentUsed > 90);
      if (overBudget) {
        tips.push({
          title: `${overBudget.category} Budget Alert`,
          content: `Your ${overBudget.category} budget is ${overBudget.percentUsed}% used. Consider adjusting your spending for the rest of the month or reviewing if this budget needs to be increased.`
        });
      } else {
        tips.push({
          title: "Budget Management",
          content: "You're keeping within budget this month. Consider allocating any excess to your savings or emergency fund to build financial security."
        });
      }
    } else {
      tips.push({
        title: "Create Budget Categories",
        content: "Set up budget categories for your major expense types. Start with housing, food, transportation, and entertainment to gain better control of your spending."
      });
    }

    // Generate tip about savings
    if (financialData.savingsRate !== undefined) {
      if (financialData.savingsRate < 20) {
        tips.push({
          title: "Boost Your Savings",
          content: `Your current savings rate is ${financialData.savingsRate}%. Try the 50/30/20 rule: 50% for needs, 30% for wants, and 20% for savings or debt repayment.`
        });
      } else {
        tips.push({
          title: "Optimize Your Investments",
          content: `With a strong savings rate of ${financialData.savingsRate}%, consider diversifying your investments. Look into index funds or ETFs for long-term growth with minimal fees.`
        });
      }
    } else {
      tips.push({
        title: "Start Saving Today",
        content: "Aim to save at least 10% of your income each month. Set up automatic transfers to a separate savings account right after payday to make saving effortless."
      });
    }

    return tips;
  };

  useEffect(() => {
    // Only generate tips when we have sufficient data
    if (summaryData || budgetPerformance) {
      // Prepare data for prompt generation
      const financialData = {
        summaryData,
        budgetPerformance,
        topExpenseCategories: summaryData?.topCategories || [],
        savingsRate: savingsData?.summary?.averageSavingsRate || 0,
        monthlyIncome: summaryData?.income || 0,
        monthlyExpenses: summaryData?.expenses || 0
      };

      // Generate the prompt (this would be sent to an AI API in a real app)
      const prompt = generateFinancialTipsPrompt(financialData);
    //   console.log("Generated prompt:", prompt);

      // For now, use the mock generator
      const generatedTips = generateMockTips(financialData);
      setTips(generatedTips);
    }
  }, [summaryData, budgetPerformance, savingsData]);

  return (
    <div>
      {tips.length > 0 ? (
        <div className="space-y-3">
          {tips.map((tip, index) => (
            <div 
              key={index}
              className={`p-3 ${
                index === 0 
                  ? isDark ? 'bg-purple-900/20' : 'bg-[#ffc8dd]'
                  : index === 1 
                  ? isDark ? 'bg-teal-900/20' : 'bg-[#bde0fe]' 
                  : isDark ? 'bg-amber-900/20' : 'bg-[#a2d2ff]'
              } rounded-lg`}
            >
              <h4 className="font-medium">{tip.title}</h4>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {tip.content}
              </p>
            </div>
          ))}
        </div>
      ) : (
        // Display placeholders while loading
        <>
          <div className={`p-3 ${isDark ? 'bg-blue-900/20' : 'bg-blue-50'} rounded-lg animate-pulse`}>
            <h4 className="font-medium">Loading financial tips...</h4>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Analyzing your financial data to provide personalized recommendations.
            </p>
          </div>
          <div className={`p-3 ${isDark ? 'bg-green-900/20' : 'bg-green-50'} rounded-lg animate-pulse`}>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-full mb-1"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-4/5"></div>
          </div>
        </>
      )}
    </div>
  );
}

export default DashboardTips;