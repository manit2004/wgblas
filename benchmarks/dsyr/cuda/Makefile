CC = nvcc
BIN = bin
HDRS = ../../utils/helpers.h ../../utils/harness.h ../../utils/params.h

all: $(BIN)/dsyr

$(BIN):
	mkdir -p $(BIN)

$(BIN)/dsyr: dsyr.c $(HDRS) | $(BIN)
	$(CC) dsyr.c -o $(BIN)/dsyr -lcublas

clean:
	rm -rf $(BIN)
