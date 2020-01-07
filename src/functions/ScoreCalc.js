export default (mines, area, k_weight, k_diameter, total_hp, remaining_hp, time, clicks) => {
    //only score games that were won
    
    // +mine density = +points
    // +k_diameter = +points
    // +k_weight = +points
    // +hp_ratio = +points
    // -time = +points
    // -clicks = +points

    // bonuses for:
    // full hp
    // 1 hp left && more than 3 mines on board
    // less than 2 clicks per mine on board
    // less than 2 seconds per mine on board
    // more than 1 click per second, discounting mine clicks
    // 1 bonus for each null mine safely found
    

    return
}