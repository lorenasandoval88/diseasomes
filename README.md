

# prs
Calculation polygenic risk for individual 23andme mutation reports using PGS catalog. Live at https://episphere.github.io/prs !

# public 23andme sample files: 

The participants in the Personal Genome Project (PGP) have volunteered to share their DNA sequences, medical information, and other personal information with the research community and the general public.

https://my.pgp-hms.org/public_genetic_data?data_type=23andMe

female sample (dorothy): https://my.pgp-hms.org/profile/hu54EEB2
male sample (chad):  https://my.pgp-hms.org/profile/huDA1243

# About info
 The PRS calculator relies solely on published/validated/open-source risk scores from the PGS catalog, whereas consumer genomics companies use proprietary algorithms that cannot be readily reproduced by others. Additionally, we observed that the inherent reusability of this design led to the use of the PRS calculator as a research tool to compare different PGS catalog entries, by reviewing the in-browser SNPedia and dbSNP analysis. It should be noted that this calculator was devised as a proof of concept and it has a number of important limitations for research or clinical use. First, the current tool uses pre-imputation genotype data and thus results in a low number of SNP matches, making interpretation of PRS difficult. Second, the tool only provides the raw PRS and does not calculate relative or absolute risk of disease. Future work enabling the use of imputed or sequencing data (of much larger size) covering variation across the whole genome, and integration of raw PRS into risk models, is needed. Further considerations are also required prior to clinical use of PRS  (Hao et al 2022).

