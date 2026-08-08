import { useState } from "react";

const TIPS = [
  {
    cat:"Nutrition", title:"Top 10 Cheap Protein Sources for Indians",
    points:["Eggs â‚¹7 each â€” 6g protein per egg, cheapest complete protein","Soya chunks â‚¹40/kg â€” 52g protein per 100g, better than chicken","Masoor/Moong/Chana dal â€” 22-26g protein per 100g","Peanuts â‚¹100/kg â€” 26g protein, healthy fats included","Milk â‚¹50/L, Curd â€” great protein + gut health","Chicken breast â‚¹200/kg â€” 31g protein per 100g, best lean meat"],
    tip:"Daily target: 1.6â€“2g protein per kg bodyweight. 65kg person needs 104â€“130g/day. Achievable under â‚¹100/day."
  },
  {
    cat:"Fat Loss", title:"Why Indians Struggle to Lose Belly Fat",
    points:["Too many refined carbs â€” maida, white rice spike insulin which signals fat storage","Large carb-heavy portions at every meal","Sedentary lifestyle â€” most Indians don't walk enough","Late-night heavy dinners â€” increases fat storage overnight","Stress and poor sleep â€” cortisol directly causes belly fat"],
    tip:"You cannot spot-reduce belly fat. Reduce overall body fat through diet + exercise. Belly goes last â€” be consistent."
  },
  {
    cat:"Fat Loss", title:"Why Indians Struggle to Lose Belly Fat",
    points:["Too many refined carbs â€” maida, white rice spike insulin which signals fat storage","Large carb-heavy portions at every meal","Sedentary lifestyle â€” most Indians don't walk enough","Late-night heavy dinners â€” increases fat storage overnight","Stress and poor sleep â€” cortisol directly causes belly fat"],
    tip:"You cannot spot-reduce belly fat. Reduce overall body fat through diet + exercise. Belly goes last â€” be consistent."
  },
  {
    cat:"Indian Superfoods", title:"5 Indian Superfoods to Eat Every Day",
    points:["Turmeric (Haldi) â€” most powerful anti-inflammatory, combine with black pepper","Methi (Fenugreek) â€” controls blood sugar, aids digestion","Amla â€” 20x more Vitamin C than oranges, excellent immunity booster","Moong dal â€” easiest to digest, high protein, best for weight loss","Ghee (1 tsp/day) â€” aids vitamin absorption and gut health in small amounts"],
    tip:"These aren't exotic imports â€” they're in every Indian kitchen. Healthiest diet for an Indian body is Indian food, cooked right."
  },
  {
    cat:"Hydration", title:"How Much Water Should Indians Actually Drink?",
    points:["No exercise: 2.5â€“3 litres/day minimum","Home workout: 3â€“3.5 litres/day","Gym training: 3.5â€“4 litres/day","Summer: add 0.5â€“1 litre extra","Dark yellow urine = you're dehydrated. Aim for pale yellow all day"],
    tip:"Chaas (buttermilk) and coconut water count. Add lemon + salt after intense exercise to replace electrolytes."
  },
  {
    cat:"Muscle Building", title:"How to Build Muscle as a Beginner in India",
    points:["Progressive overload â€” lift slightly more weight each week. Only way muscles grow.","1.6â€“2g protein per kg bodyweight daily â€” non-negotiable","7â€“8 hours sleep â€” muscle builds during sleep, not during workout","Track your weights â€” if you're not lifting more than last week, you're not growing","Creatine monohydrate â‚¹600/month â€” only supplement with real science behind it"],
    tip:"First 6 months you gain muscle AND lose fat simultaneously â€” only beginners can do this. Don't waste this phase."
  },
  {
    cat:"Lifestyle", title:"Why Sleep is Your Most Powerful Fat Loss Tool",
    points:["Less sleep â†’ cortisol rises â†’ belly fat storage increases directly","Less sleep â†’ ghrelin rises â†’ you feel 25% more hungry all day","Less sleep â†’ growth hormone drops 70% â†’ far less muscle building","Phone down 30 min before bed â€” blue light kills melatonin","Fixed sleep + wake time every day, even weekends â€” most important habit"],
    tip:"If you sleep 5â€“6 hours and not seeing results â€” this is the biggest factor holding you back, more than diet or workout."
  },
];
export default function TipsPage() {
  const [open, setOpen] = useState(null);
  const C = {card:"#141E11",card2:"#1C2818",line:"#2A3825",ink:"#E8DFB8",muted:"#7A9070",lime:"#6DBF4A",limeD:"#1A3010",limeDk:"#3A7020",red:"#E05252",redD:"#2A1010"};

  return (
    <div style={{padding:"0 0 20px"}}>
      <div style={{padding:"24px 20px 0"}}>
        <div style={{display:"inline-block",fontSize:10,letterSpacing:".2em",textTransform:"uppercase",color:C.lime,fontWeight:800,border:`1px solid ${C.limeDk}`,background:C.limeD,borderRadius:20,padding:"5px 14px",marginBottom:12}}>Health Tips</div>
        <div style={{fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:800,marginBottom:4}}>Free health articles</div>
        <div style={{fontSize:13,color:C.muted}}>Real science, Indian context, no jargon.</div>
      </div>
      <div style={{padding:"16px 20px 0"}}>
        {TIPS.map((t,i)=>(
          <div key={i} style={{background:C.card,border:`1px solid ${i===open?C.lime:C.line}`,borderRadius:14,padding:18,marginBottom:10,cursor:"pointer"}} onClick={()=>setOpen(open===i?null:i)}>
            <div style={{fontSize:10,textTransform:"uppercase",letterSpacing:".12em",fontWeight:800,color:C.lime,marginBottom:8}}>{t.cat}</div>
            <div style={{fontFamily:"'Syne',sans-serif",fontSize:16,fontWeight:800,marginBottom:6,lineHeight:1.3}}>{t.title}</div>
            {open===i && (
              <div style={{marginTop:12}}>
                <ul style={{paddingLeft:18,marginBottom:12}}>
                  {t.points.map((p,j)=><li key={j} style={{fontSize:13,color:C.muted,lineHeight:1.7,marginBottom:6}}>{p}</li>)}
                  </ul>
                <div style={{background:C.limeD,border:`1px solid ${C.limeDk}`,borderRadius:10,padding:"12px 14px",fontSize:13,color:C.lime,lineHeight:1.6}}>ðŸ’¡ {t.tip}</div>
              </div>
            )}
            <div style={{fontSize:11,fontWeight:800,color:C.lime,textTransform:"uppercase",letterSpacing:".1em",marginTop:8}}>{open===i?"â–² Close":"Read more â–¼"}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
